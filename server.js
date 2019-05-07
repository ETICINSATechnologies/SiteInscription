const express = require('express');
const app = express();
const path = require('path');
const fetch = require('node-fetch')
const port = process.env.PORT || 5000;
require('dotenv').config();

//global variables
let api_token='';

//Static file declaration
app.use(express.static(path.join(__dirname, 'client/build')));

//Retrieve the raw body as a buffer and match all content types
app.use(require('body-parser').raw({type: '*/*'}));

//Stripe parameters
const stripe = require("stripe")(process.env.STRIPE_SK);
const endpointSecret = process.env.STRIPE_EP_SK;

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

app.post('/api/membre-inscription', (req,res) => {
  res.send('null');
  res.status(201).end();
})

app.post('/api/consultant-inscription', (req,res) => {
  res.send('null');
  res.status(201).end();
})

// stripe path
app.post('/api/webhook', (request, response) => {
  let sig = request.headers["stripe-signature"];

  try {
    const event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      // Fulfill the purchase...
      handleCheckoutSession(session);
    }
  }
  catch (err) {
    response.status(400).end()
  }

  // Return a response to acknowledge receipt of the event
  response.json({received: true});
});

//production mode only
if(process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  //
  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
  })
} else { //development mode

  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname+'/client/public/index.html'));
  })

}

//server-side functions
  // login
  const login = () =>  {
    const loginpath = process.env.API_HOST + '/api/v1/auth/login';
    const user = {username: process.env.API_USER, password: process.env.API_PASSWORD};
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
              res.json().then(result => {api_token = result.token});
          } else {
            console.log ('Failed to login to keros :o, the app will not function correctly !');
          }
      })
  }

  // get meta data
  const getDepartments = async() => {
    let response = await fetch((process.env.API_HOST +'/api/v1/core/department'), {
      headers: { Authorization: api_token }
    });
    let data = await response.json();
    return data;
  }

  const getPoles = async() => {
    let response = await fetch((process.env.API_HOST +'/api/v1/core/pole'), {
      headers: { Authorization: api_token }
    });
    let data = await response.json();
    return data;
  }

  const getCountries = async() => {
    let response = await fetch((process.env.API_HOST +'/api/v1/core/country'), {
      headers: { Authorization: api_token }
    });
    let data = await response.json();
    return data;
  }

  const getGenders = async() => {
    let response = await fetch((process.env.API_HOST +'/api/v1/core/gender'), {
      headers: { Authorization: api_token }
    });
    let data = await response.json();
    return data;
    
  const handleCheckoutSession = (session) => {
      console.log('checkout session received');

      //get member using session client id
  }



//start server
app.listen(port, (req, res) => {
  console.log( `Server listening on port: ${port}`);
  login(); //login to keros
})
