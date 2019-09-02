const EmailSender = require('./services/EmailSender/EmailSender').EmailSender;
const makeHTML = require('./services/Helpers/EmailHelpers').makeHTML;

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

app.get('/api/meta', (req, res) => {
  res.send(keros_meta);
})

app.use('/api/membre-inscription', proxy(process.env.API_HOST, {
  proxyReqOptDecorator: function (proxyReqOpts) {
    proxyReqOpts.headers['Authorization'] = api_token;
    return proxyReqOpts;
  },
  proxyReqPathResolver: function () {
    return '/api/v1/sg/membre-inscription';
  }
}));

app.use('/api/consultant-inscription', proxy(process.env.API_HOST, {
  proxyReqOptDecorator: function (proxyReqOpts) {
    proxyReqOpts.headers['Authorization'] = api_token;
    return proxyReqOpts;
  },
  proxyReqPathResolver: function () {
    return '/api/v1/sg/consultant-inscription';
  },
  userResDecorator: function (proxyRes, proxyResData, userReq, userRes) {
    if (proxyRes.statusCode === 201) {
      const dataString = proxyResData.toString('utf8');
      const data = JSON.parse(dataString);
      setTimeout(() => {
        sendEmailConsultant(data)
      }, 3000)
    }
    return proxyResData;
  }
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
    }
  }
  catch (err) {
    res.status(400).end()
  }

  // Return a response to acknowledge receipt of the event
  res.json({ received: true });
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
}

/* Services */

const loginKeros = async (callback) => {
  const loginpath = process.env.API_HOST + '/api/v1/auth/login';
  const user = { username: process.env.API_USER, password: process.env.API_PASSWORD };

  const relogin = () => {
    console.log('Failed to login to keros, trying again in 30s');
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
        console.log("Logged into keros");
        res.json()
          .then((result) => {
            api_token = result.token;
            if (callback) callback();
          })
          .catch(() => {

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
  console.log('Getting keros meta data');
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
  console.log('Receiving checkout session');
  console.log('Stripe checkout session received from ' + session.client_reference_id);
  try {
    fetch((process.env.API_HOST + '/api/v1/sg/membre-inscription/' + session.client_reference_id + '/confirm-payment'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: api_token
      }
    }).then((res) => {
      if (res.ok) {
        sendEmailMember(session.client_reference_id)
      }
    })
  } catch (e) {
    console.log('Error confirming payment')
  }
}

const sendEmailMember = (id) => {
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
              }
              const emailSender = new EmailSender(process.env.EMAIL_PROVIDER, email_auth);
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
  //make html body
  const html = makeHTML(data, true);
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
          console.log('Error getting filename', e.message)
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
      console.log('Warning : Error getting a file')
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
  const emailSender = new EmailSender(process.env.EMAIL_PROVIDER, email_auth);
  emailSender.sendEmail(mailOptions);
}

const testFunction = () => {
  const url = `${process.env.API_HOST}/api/v1/sg/consultant-inscription/${9}`
  fetch(url, {
    headers: { Authorization: api_token }
  }).then((res) => {
    if (res.ok) {
      res.json().then(data => {
        sendEmailConsultant(data)
      })
    }
  })
}

/* Server */

app.listen(port, (req, res) => {
  console.log(`Server listening on port: ${port}`);
  loginKeros(refreshMeta);
  setInterval(() => {
    loginKeros(refreshMeta);
  }, refreshInterval);
  //setTimeout(testFunction, 3000);
})
