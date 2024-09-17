import Framework7, { getDevice } from './framework7-custom.js';

// Import F7 Styles
import '../css/framework7-custom.less';

// Import Icons and App Custom Styles
import '../css/icons.css';
import '../css/app.less';
// Import Cordova APIs
import cordovaApp from './cordova-app.js';

// Import Routes
import routes from './routes.js';

// Import Store
import store from './store.js';

// Import main app component
import App from '../app.f7';

var device = getDevice();

var app = new Framework7({
  name: 'Driver Stats', // App name
  // theme: 'auto', // Automatic theme detection
  colors: {
    primary: '#d8fc0b',
  },
  darkMode: true,
  el: '#app', // App root element
  component: App, // App main component
  store,   // App store
  routes: routes,   // App routes
  theme: 'ios',
  input: {   // Input settings
    scrollIntoViewOnFocus: device.cordova,
    scrollIntoViewCentered: device.cordova,
  },
  statusbar: {   // Cordova Statusbar settings
    iosOverlaysWebView: true,
    androidOverlaysWebView: false,
  },
  on: {
    init: function () {
      var f7 = this;
      if (f7.device.cordova) {
        cordovaApp.init(f7);          // Init cordova APIs (see cordova-app.js)
      }
    },
  },
});