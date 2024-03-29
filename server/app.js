const EmailSender = require('./services/EmailSender/EmailSender').EmailSender;
const makeHTML = require('./services/Helpers/EmailHelpers').makeHTML;
const PDFFiller = require('./services/PDFFiller/PDFFiller').PDFFiller;

const express = require('express')
const app = express();
const path = require('path');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const fs = require('file-system');
const port = process.env.PORT || 5000;
const stripe = require("stripe")(process.env.STRIPE_SK);
const proxy = require('express-http-proxy');
const rp = require('request-promise-native');
const formidable = require('formidable');
const FormData = require('form-data');
const { createLogger, format, transports } = require('winston');


require('dotenv').config();

/* Global Variables */

let api_token = '';

const keros_meta = {
  'gender': [],
  'country': [],
  'department': [],
  'pole': [],
}
const refreshInterval = 12 * 3600 * 1000; //12 hours
const endpointSecret = process.env.STRIPE_EP_SK;

const email_auth = {
  user: process.env.EMAIL_ADDRESS,
  pass: process.env.EMAIL_PASS
}

const email_sg = process.env.EMAIL_SG;

/* Logger */
const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log`.
    // - Write all logs error (and below) to `error.log`.
    //
    new transports.File({ filename: path.join(__dirname, '../logs/error.log'), level: 'error' }),
    new transports.File({ filename: path.join(__dirname, '../logs/combined.log') })
  ]
});


/* Static File Declaration */

app.use(express.static(path.join(__dirname, '../client/build')));

/* Routes */

app.get('/api/file/:filename', (req, res) => {
  const path = `../files/${req.params.filename}.pdf`;
  fs.access(path, fs.F_OK, (err) => {
    if (err) {
      res.status(404).end()
    }
    res.download(path)
  });
})

app.get('/api/meta', (_, res) => {
  res.send(keros_meta);
})

app.post('/api/membre-inscription/:id/signature', (req, res) => {
  logger.info(`Received signature from ${req.params.id}`)
  new formidable.IncomingForm().parse(req)
    .on('fileBegin', (_,file) => {
      file.path = __dirname + `/storage/signatures/${req.params.id}.png`
    })
    .on('file', (name,_) => {
      logger.info(`Uploaded ${name}`)
    })
    .on('aborted', () => {
      logger.error(`Request aborted by the user`)
    })
    .on('error', (err) => {
      logger.error(`Request aborted by the user`)
      logger.error(err)
      throw err
    })
    .on('end', () => {
      res.end()
      prepareEmailMember(req.params.id)
    })
});

app.use('/api/membre-inscription', proxy(process.env.API_HOST, {
  proxyReqOptDecorator: function (proxyReqOpts) {
    logger.info(`Adding authorization header to member inscription`);
    proxyReqOpts.headers['Authorization'] = api_token;
    return proxyReqOpts;
  },
  proxyReqPathResolver: function () {
    logger.info(`Forwarding member inscription`);
    return '/api/v1/sg/membre-inscription';
  },
  limit: '50mb'
}));

app.use('/api/consultant-inscription', proxy(process.env.API_HOST, {
  proxyReqOptDecorator: function (proxyReqOpts) {
    logger.info(`Adding authorization header to consultant inscription`);
    proxyReqOpts.headers['Authorization'] = api_token;
    return proxyReqOpts;
  },
  proxyReqPathResolver: function () {
    logger.info(`Forwarding consultant inscription`);
    return '/api/v1/sg/consultant-inscription';
  },
  userResDecorator: function (proxyRes, proxyResData, _, _) {
    if (proxyRes.statusCode === 201) {
      logger.info(`Successfully created consultant inscription`);
      const dataString = proxyResData.toString('utf8');
      const data = JSON.parse(dataString);
      setTimeout(() => {
        sendEmailConsultant(data)
      }, 3000)
    } else {
      logger.error(`Error creating consultant inscription on keros with code : ${proxyRes.statusCode}`);
      let error = `Unknown error`;
      try {
        const dataString = proxyResData.toString('utf8');
        error = dataString;
      } catch (error) { }
      logger.error(error);
    }
    return proxyResData;
  },
  limit: '50mb'
}));

app.post('/api/webhook', bodyParser.raw({ type: 'application/json' }), (req, res) => {
  let sig = req.headers["stripe-signature"];

  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      // Fulfill the purchase...
      handleCheckoutSession(session);

      // Return a response to acknowledge receipt of the event
      res.json({ received: true });
    }
  }
  catch (err) {
    res.status(400).end()
  }
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  //
  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  })
} else {
  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/public/index.html'));
  })
  logger.add(new transports.Console({
    format: format.combine(
      format.colorize(),
      format.simple()
    )
  }));
}

/* Services */

const loginKeros = async (callback) => {
  const loginpath = process.env.API_HOST + '/api/v1/auth/login';
  const user = { username: process.env.API_USER, password: process.env.API_PASSWORD };

  const relogin = () => {
    logger.error(`Failed to login to keros, trying again in 30s`);
    setTimeout(() => { loginKeros(callback) }, 30000);
  }

  fetch(loginpath,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    })
    .then((res) => {
      if (res.ok) {
        logger.info(`Logged into keros`);
        res.json()
          .then((result) => {
            api_token = result.token;
            if (callback) callback();
          })
      } else {
        relogin();
      }
    })
    .catch(() => {
      relogin();
    })

}

const refreshMeta = async () => {
  logger.info(`Getting keros meta data`);
  for (const key in keros_meta) {
    keros_meta[key] = await getMeta(key);
  }
}

const getMeta = async (info) => {
  let response = await fetch((process.env.API_HOST + `/api/v1/core/${info}`), {
    headers: { Authorization: api_token }
  });
  let data = await response.json();
  return data;
}

const handleCheckoutSession = (session) => {
  logger.info(`Receiving checkout session`);
  //check sku refers to member inscription
  if (session.display_items && session.display_items.length && session.display_items[0].sku) {
    if (session.display_items[0].sku.id === process.env.REACT_APP_STRIPE_PRODUCT) {
      logger.info(`Stripe inscription checkout session received from ${session.client_reference_id}`);
      try {
        fetch((process.env.API_HOST + '/api/v1/sg/membre-inscription/' + session.client_reference_id + '/confirm-payment'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: api_token
          }
        }).then((res) => {
          if (res.ok) {
            prepareEmailMember(session.client_reference_id)
          }
        })
      } catch (e) {
        logger.error(`Error confirming payment`);
      }
    } else {
      logger.info(`Stripe checkout session received for non-inscription product ${session.display_items[0].sku.id}`);
    }
  }

}

const prepareEmailMember = (id) => {
  makeFicheInscription(id)
}

const sendEmailMember = (id, attachments) => {
  try {
    fetch((process.env.API_HOST + '/api/v1/sg/membre-inscription/' + id), {
      headers: { Authorization: api_token }
    })
      .then((res) => {
        if (res.ok) {
          res.json()
            .then((member) => {
              const html = makeHTML(member, false);
              const mailOptions = {
                from: email_auth.user,
                to: email_sg,
                subject: `Nouvelle Inscription - Membre (ID - ${id})`,
                html: html,
                attachments: attachments
              }
              const emailSender = new EmailSender(process.env.EMAIL_PROVIDER, email_auth, logger);
              emailSender.sendEmail(mailOptions);
            })
        }
      })
  } catch (e) {
    console.log('Error sending member inscription email')
  }
}
const sendEmailConsultant = async (data) => {
  const id = data.id
  fetch((process.env.API_HOST + '/api/v1/sg/consultant-inscription/' + id + '/protected'), {
    headers: { Authorization: api_token }
  })
    .then((res) => {
      if (res.ok) {
        res.json()
          .then(async (consultant) => {
            //make body
            const html = makeHTML(consultant, true);
            //make attachments
            const documentList = ['documentIdentity', 'documentScolaryCertificate', 'documentRIB', 'documentVitaleCard', 'documentCVEC', 'documentResidencePermit']
            const attachments = []
            for (const documentName of documentList) {
              const url = `${process.env.API_HOST}/api/v1/sg/consultant-inscription/${id}/document/${documentName}`;
              const options = {
                url: url,
                headers: { Authorization: api_token },
                encoding: null
              };
              const callback = (error, response, body) => {
                if (!error && response.statusCode == 200) {
                  let filename = documentName;
                  let filesize = 0;
                  try {
                    const contentDispo = response.headers['content-disposition']
                    const startIndex = contentDispo.indexOf("filename=") + 10;
                    const endIndex = contentDispo.length - 1;
                    const headerFilename = contentDispo.substring(startIndex, endIndex);
                    if (headerFilename) filename += '.' + headerFilename.split('.')[1];
                    const contentLength = response.headers['content-length']
                    if (contentLength) filesize = Number(contentLength);
                  } catch (e) {
                    logger.error(`Error getting filename`);
                    logger.error(e.message);
                  }
                  attachments.push({
                    filename: filename,
                    content: body,
                    filesize: filesize
                  })
                }
              }
              try {
                await rp(options, callback);
              } catch (e) {
                logger.info(`Warning : Error getting a file`);
              }
            }
            //make email
            const mailOptions = {
              from: email_auth.user,
              to: email_sg,
              subject: `Nouvelle Inscription - Consultant (ID - ${id})`,
              html: html,
              attachments: attachments
            }
            const emailSender = new EmailSender(process.env.EMAIL_PROVIDER, email_auth, logger);
            emailSender.sendEmail(mailOptions);
          })
      } else {
        logger.error(`Error fetching consultant inscription from keros`);
      }
    })
    .catch((e) => {
      logger.error(`Error fetching consultant inscription from keros`);
    })
}

const makeFicheInscription = async (id) => {
  const url = process.env.API_HOST + `/api/v1/sg/membre-inscription/${id}/document/1/generate`;
  try {
    const res = await fetch(url, { headers: { Authorization: api_token } });
    if (!res.ok) throw Error("Keros failed to generate fiche d'inscription");

    const data = await res.json();
    const fileResponse = await fetch(data.location);

    if (!fileResponse.ok) throw Error("Error downloading fiche d'inscription");

    const filePath = __dirname + `/storage/fiches_inscription/${id}.pdf`;
    const file = fs.createWriteStream(filePath);
    fileResponse.body.pipe(file);
    fileResponse.body.on("error", (err) => { throw Error("Error saving fiche d'inscription") });
    file.on('finish', () => {
      file.close(() => { addSignature(id, filePath) });
    });
  } catch (e) {
    logger.error(e);
    logger.error(`Error generating fiche d'inscription, sending email without it`);
    sendEmailMember(id, [])
  }

}

const addSignature = (id, originalPDF) => {
  const newPDF = __dirname + `/storage/fiches_inscription_signed/${id}.pdf`
  const signature = __dirname + `/storage/signatures/${id}.png`
  const pdfFiller = new PDFFiller(originalPDF, newPDF)
  pdfFiller.addSignature(signature, { x: 465, y: 730 }, 40)
  pdfFiller.writeChanges()
  const filename = `fiche_inscription_membre_actif_${id}.pdf`;
  const filesize = fs.statSync(newPDF).size;
  const content = fs.readFileSync(newPDF);
  const attachments = [{ filename, filesize, content }]
  sendEmailMember(id, attachments)
  uploadInscriptionForm(id, newPDF)
}

const uploadInscriptionForm = (id, signedPDF) => {
  let formData = new FormData();
  formData.append('file', fs.createReadStream(signedPDF), `fiche_inscription_membre_${id}.pdf`);
  fetch((`${process.env.API_HOST}/api/v1/sg/membre-inscription/${id}/document/1`), {
    method: 'POST',
    headers: {
      Authorization: api_token
    },
    body: formData
  })
    .then((res) => {
      if (res.ok) {
        logger.info(`Ficher d'inscription uploaded for member inscription ${id}`);
      } else {
        logger.error(`Ficher d'inscription not uploaded for member inscription ${id} : ${res.status}`);
      }
    })
    .catch((error) => {
      logger.error(`Ficher d'inscription not uploaded for member inscription ${id} : ${error}`);
    })
}

const testFunction = () => {
  //uploadInscriptionForm(3, './test.pdf')
  //prepareEmailMember(32);
}

/* Server */

app.listen(port, (req, res) => {
  logger.info(`Server listening on port: ${port}`);
  console.log(`Server listening on port: ${port}`);
  loginKeros(refreshMeta);
  setInterval(() => {
    loginKeros(refreshMeta);
  }, refreshInterval);
  //setTimeout(testFunction, 1000);
})
