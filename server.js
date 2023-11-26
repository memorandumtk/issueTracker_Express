'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const expect = require('chai').expect;
const cors = require('cors');
require('dotenv').config();

const apiRoutes = require('./routes/api.js');
const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner');
require('dotenv').config()
let app = express();

app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({ origin: '*' })); //For FCC testing purposes only


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const requestLogger = (request, response, next) => {
  console.log(`${request.method} url:: ${request.url}`);
  console.log('body::')
  console.log(request.body);
  next()
}
app.use(requestLogger)


//Sample front-end
app.route('/:project/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/issue.html');
  });

//Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });

//For FCC testing purposes
fccTestingRoutes(app);

//Routing for API 
apiRoutes(app);


// Ref site: https://reflectoring.io/express-error-handling/
// Error handling Middleware functions
const errorLogger = (error, request, response, next) => {
  console.log(`error ${error.message}`)
  next(error) // calling next middleware
}

const errorResponder = (error, request, response, next) => {
  response.header("Content-Type", 'application/json')

  const status = error.status || 400
  response.status(status).send(error.message)
}
const invalidPathHandler = (request, response, next) => {
  response.status(400)
  response.send('invalid path')
}

app.use(errorLogger)
app.use(errorResponder)
app.use(invalidPathHandler)

//Start our server and tests!
const listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
  if (process.env.NODE_ENV === 'test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch (e) {
        console.log('Tests are not valid:');
        console.error(e);
      }
    }, 3500);
  }
});

module.exports = app; //for testing
