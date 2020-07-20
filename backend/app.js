require('module-alias/register');
require('@app/core/config');
// require('@app/core/mongo');

const express = require('express');
// const mongoose = require('mongoose');
const path = require('path');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const featurePolicy = require('feature-policy');

const router = require('@app/router');

// const cors = require('cors');
// const expressEnforcesSSL = require('express-enforces-ssl');

const app = express();
const port = process.env.PORT || 3000;
const allowedExt = ['.js', '.ico', '.css', '.png', '.jpg', '.woff2', '.woff', '.ttf', '.svg', '.eot'];
const appRoot = path.resolve(__dirname);
global.appRoot = appRoot;

const initiateExpressListener = async () => {
  console.info('Initializing Node Server...');
  app.enable('trust proxy');

  // app.use(cors());
  // app.use(expressEnforcesSSL());

  app.use(helmet());
  // app.use(helmet.noCache());
  app.use(helmet.noSniff());
  app.use(helmet.ieNoOpen());
  app.use(helmet.xssFilter());
  app.use(helmet.hidePoweredBy());
  app.use(helmet.dnsPrefetchControl());
  app.use(helmet.permittedCrossDomainPolicies());
  app.use(helmet.frameguard({ action: 'sameorigin' }));
  app.use(featurePolicy({ features: { vibrate: ['\'none\''] } }));
  app.use(helmet.referrerPolicy({ policy: 'no-referrer-when-downgrade' }));

  app.use(helmet.hsts({
    preload           : true,
    includeSubDomains : true,
    maxAge            : 1000 * 60 * 60 * 24 * 30,
  }));

  app.use(compression());

  app.use(bodyParser.raw({ limit: '50mb' }));
  app.use(bodyParser.text({ limit: '50mb' }));
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  app.use(cookieParser());

  // api routes
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS, POST, PUT');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin, Accept, Authorization, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, timezone');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'sameorigin');
    next();
  });

  app.use('/api/v1', router);

  // error handling
  app.use((err, req, res, next) => {
    if(err.name && err.name === 'ValidationError') {
      var validationErrors = [];
      Object.keys(err.errors).forEach(key => validationErrors.push(err.errors[key].message));
      res.status(422).send(validationErrors);
    } else if(err && err.status && err.status !== 200) {
      res.status(err.status).send({
        success : false,
        error   : true,
        status  : err.status ? err.status : 500,
        errors  : err.errors ? err.errors : undefined,
        title   : err.title ? err.title : 'Internal server error!',
        message : err.message ? err.message : 'Undefined server error.'
      });
    }
    next();
  });

  app.get('*', (req, res) => {
    if(allowedExt.filter(ext => req.url.indexOf(ext) > 0).length > 0) {
      let splitString = req.url.split('?');
      if(splitString && splitString[0]) {
        res.sendFile(path.resolve(`./web/${splitString[0]}`));
      }
    } else {
      res.sendFile(path.resolve('./web/index.html'));
    }
  });

  app.on('error', (error) => {
    console.error(error);
  });

  process.on('uncaughtException', (error) => {
    console.error(error);
  });

  app.listen(port);
};

// mongoose.connection.on('connected', () => {
initiateExpressListener().then(() => {
  getIP();
  console.log('Node Server Initialized On', port);
}).catch((error) => {
  console.error('Node Server Initialization Failed : ', error);
});
// });

function getIP() {
  var os = require('os');
  var ifaces = os.networkInterfaces();

  Object.keys(ifaces).forEach(function (ifname) {
    var alias = 0;

    ifaces[ifname].forEach(function (iface) {
      if('IPv4' !== iface.family || iface.internal !== false) {
        // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
        return;
      }

      if(alias >= 1) {
        // this single interface has multiple ipv4 addresses
        console.log(ifname + ':' + alias, iface.address);
      } else {
        // this interface has only one ipv4 adress
        console.log(ifname, iface.address);
      }
      ++alias;
    });
  });
}