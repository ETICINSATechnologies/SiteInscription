const express = require('express')
const app = express();
const path = require('path')
const fetch = require('node-fetch')
const Busboy = require('busboy');
const bodyParser = require('body-parser');
const FormData = require('form-data');
const port = process.env.PORT || 5000
require('dotenv').config();

//global variables
let api_token = '';

//Static file declaration
app.use(express.static(path.join(__dirname, 'client/build')));

//Stripe parameters
const stripe = require("stripe")(process.env.STRIPE_SK);
const endpointSecret = process.env.STRIPE_EP_SK;

app.get('/api/fiche-inscription', (req, res) => {
  res.download('./files/Fiche_inscription_membre_actif.pdf')
})

app.get('/api/department', (req, res) => {
  getDepartments().then(data => res.send(data));
})

app.get('/api/pole', (req, res) => {
  getPoles().then(data => res.send(data));
})

app.get('/api/country', (req, res) => {
  getCountries().then(data => res.send(data));
})

app.get('/api/gender', (req, res) => {
  getGenders().then(data => res.send(data));
})

app.post('/api/membre-inscription', (req, res) => {
  var busboy = new Busboy({ headers: req.headers });
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

app.post('/api/consultant-inscription', (req, res) => {
  fetch((process.env.API_HOST + '/api/v1/sg/consultant-inscription'), {
    method: 'POST',
    body: req.body,
    headers: { Authorization: api_token }
  }).then(response => {
    console.log(response.status);
    res.status(response.status).end()
  })
})

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

//production mode only
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  //
  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/build/index.html'));
  })
} else { //development mode

  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/public/index.html'));
  })

}

//server-side functions
// login
const login = () => {
  const loginpath = process.env.API_HOST + '/api/v1/auth/login';
  const user = { username: process.env.API_USER, password: process.env.API_PASSWORD };
  fetch(loginpath, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  })
    .then(res => {
      if (res.status === 200) {
        console.log("Logged into keros, all's good ! ^^");
        res.json().then(result => { api_token = result.token });
      } else {
        console.log('Failed to login to keros :o, the app will not function correctly !');
      }
    })
}

const getDepartments = async () => {
  let response = await fetch((process.env.API_HOST + '/api/v1/core/department'), {
    headers: { Authorization: api_token }
  });
  let data = await response.json();
  return data;
}

const getPoles = async () => {
  let response = await fetch((process.env.API_HOST + '/api/v1/core/pole'), {
    headers: { Authorization: api_token }
  });
  let data = await response.json();
  return data;
}

const getCountries = async () => {
  let response = await fetch((process.env.API_HOST + '/api/v1/core/country'), {
    headers: { Authorization: api_token }
  });
  let data = await response.json();
  return data;
}

const getGenders = async () => {
  let response = await fetch((process.env.API_HOST + '/api/v1/core/gender'), {
    headers: { Authorization: api_token }
  });
  let data = await response.json();
  return data;
}

const handleCheckoutSession = (session) => {
  console.log('Stripe checkout session received from ' + session.client_reference_id);
  responseBody = { hasPaid: true }
  fetch((process.env.API_HOST + '/api/v1/sg/membre-inscription/' + session.client_reference_id), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: api_token
    },
    body: JSON.stringify(responseBody)
  })
}

//start server
app.listen(port, (req, res) => {
  console.log(`Server listening on port: ${port}`);
  login(); //login to keros
})
