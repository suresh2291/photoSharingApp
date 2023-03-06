const { serverConfig } = require("../configs/index");
const mailer = require("nodemailer");
const { google } = require("googleapis");
const { OAuth2 } = google.auth;

const auth = new OAuth2(
  serverConfig.google.id,
  serverConfig.google.secret,
  //serverConfig.google.refreshToken,
  serverConfig.google.oAuthLink
);

async function sendVerificationEmail(emailId, name, url) {
  auth.setCredentials({
    refresh_token: serverConfig.google.refreshToken,
  });
  // Store the refresh token for future use
  const refreshToken = serverConfig.google.refreshToken;

  // Use the OAuth2 client to obtain an access token
  const getAccessToken = () => {
    return new Promise((resolve, reject) => {
      oauth2Client.getAccessToken((err, accessToken) => {
        if (err) {
          reject(err);
        } else {
          resolve(accessToken);
        }
      });
    });
  };

  const smtp = mailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: serverConfig.google.mailId,
      clientId: serverConfig.google.id,
      clientSecret: serverConfig.google.secret,
      refreshToken,
      accessToken: async () => {
        // Get a new access token using the refresh token
        const accessToken = await getAccessToken();
        return accessToken;
      },
    },
  });
  const mailOptions = {
    from: serverConfig.google.mailId,
    to: emailId.toString(),
    subject: "Photo Sharing Email Verification",
    html: `<div style="color:#00bfff;font-size:30px;margin:10px 0;text-align:center">Email Confirmation</div><div><span style="text-align:center;display:block;margin-left:auto;margin-right:auto">Hey ${name}! you're almost ready to start using the Photo Sharing App. Please click the button below to verify your email address.</span></div><br><a href=${url} style="width:200px;padding:10px 15px;display:block;margin-left:auto;margin-right:auto;background:#4c649b;color:#fff;text-decoration:none;text-align:center;font-weight:600">Confirm Your Account</a>`,
  };
  smtp.sendMail(mailOptions, (err, res) => {
    if (err) return err;
    return res;
  });
}

module.exports = { sendVerificationEmail };
