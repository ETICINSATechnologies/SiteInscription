const express = require('express')
const app = express();
const path = require('path');
const fetch = require('node-fetch');
const Busboy = require('busboy');
const bodyParser = require('body-parser');
const FormData = require('form-data');
const fs = require('file-system');
const port = process.env.PORT || 5000;
const stripe = require("stripe")(process.env.STRIPE_SK);
const proxy = require('express-http-proxy');

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

app.post('/api/membre-inscription', (req, res) => {
  let busboy = new Busboy({ headers: req.headers });
  let form_data = new FormData();
  let valid = true;

  busboy.on('field', function (fieldname, val) {
    form_data.append(fieldname, val);
    if (fieldname === 'hasPaid' && val === 'true') valid = false;
  });

  busboy.on("finish", function () {
    if (valid) {
      fetch((process.env.API_HOST + '/api/v1/sg/membre-inscription'), {
        method: 'POST',
        body: form_data,
        headers: { Authorization: api_token }
      }).then(response => {
        if (response.status === 201) {
          response.json()
            .then(data => {
              res.send(data).end();
            }
            )
        } else {
          res.status(response.status).end();
        }
      })
    } else {
      res.status(401).end();
    }
  });
  req.pipe(busboy);
})

app.use('/api/consultant-inscription', proxy(process.env.API_HOST, {
  proxyReqOptDecorator: function(proxyReqOpts) {
    proxyReqOpts.headers['Authorization'] = api_token;
    return proxyReqOpts;
  },
  proxyReqPathResolver: function () {
    return '/api/v1/sg/consultant-inscription';
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
  const res = await fetch(loginpath,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    })
  if (res.ok) {
    console.log("Logged into keros");
    const result = await res.json();
    api_token = result.token;
    if (callback) callback();
  } else {
    console.log('Failed to login to keros, trying again in 30s');
    setTimeout(() => { loginKeros() }, 30000);
  }
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

const handleCheckoutSession = async (session) => {
  console.log('Receiving checkout session');
  console.log('Stripe checkout session received from ' + session.client_reference_id);

  const result = await fetch((process.env.API_HOST + '/api/v1/sg/membre-inscription/' + session.client_reference_id + '/confirm-payment'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: api_token
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
})
