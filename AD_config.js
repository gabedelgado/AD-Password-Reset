const msal = require("@azure/msal-node");

const config = {
  auth: {
    clientId: "e9e03a6f-7567-4ecc-a345-f1e1e184de5e",
    authority: "https://login.microsoftonline.com/9ef229c9-5956-47cc-9f25-9ec85ee798f0",
    clientSecret: process.env.CLIENT_SECRET,
  },
  system: {
    loggerOptions: {
      loggerCallback(loglevel, message, containsPii) {
        console.log(message);
      },
      piiLoggingEnabled: false,
      logLevel: msal.LogLevel.Verbose,
    },
  },
};

// Create msal application object
const cca = new msal.ConfidentialClientApplication(config);

module.exports = { cca };
