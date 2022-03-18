var express = require("express");
var router = express.Router();

const { cca } = require("../AD_config");

/* GET home page. */
router.get("/", function (req, res, next) {
  const authCodeUrlParameters = {
    scopes: ["user.read"],
    redirectUri: "http://localhost:3000/redirect",
  };

  // get url to sign user in and consent to scopes needed for application
  cca
    .getAuthCodeUrl(authCodeUrlParameters)
    .then((response) => {
      res.redirect(response);
    })
    .catch((error) => console.log(JSON.stringify(error)));
});

router.get("/redirect", (req, res) => {
  const tokenRequest = {
    code: req.query.code,
    scopes: ["user.read"],
    redirectUri: "http://localhost:3000/redirect",
  };

  cca
    .acquireTokenByCode(tokenRequest)
    .then((response) => {
      console.log("\nResponse: \n:", response);

      req.session.accessToken = response.accessToken;
      req.session.idToken = response.idToken;
      req.session.username = response.account.username;
      res.render("index", { claims: response.idTokenClaims });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send(error);
    });
});

router.post("/elsewhere", (req, res) => {
  console.log(req.session.accessToken);
  console.log(req.session.idToken);
});

router.post("/changepassword", (req, res) => {
  const { username, password, passwordverify } = req.body;
  if (password !== passwordverify) {
    return res.render("index", { errMessage: "Passwords do not match, please try again." });
  }

  // if someone were to post to here without a session, line under might break, NEED TO TEST IF THE ? WORKS
  if (username !== req.session?.username) {
    return res.render("index", {
      errMessage: "The username was incorrect, please make sure it is the same as when you logged in.",
    });
  }

  // RUN POWERSHELL SCRIPT HERE
  console.log(`update ${req.session.username}"'"s password now`);
});

module.exports = router;
