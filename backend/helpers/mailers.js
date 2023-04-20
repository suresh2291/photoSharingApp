const { serverConfig } = require("../configs/index");
const mailer = require("nodemailer");

async function sendVerificationEmail(emailId, name, url) {
  const transporter = mailer.createTransport({
    host: 'smtp.gmail.com',
    port: serverConfig.google.port,
    auth: {
        user: `${serverConfig.google.mailId}`,
        pass: `${serverConfig.google.password}`
    }
});
  const mailOptions = {
    from: `${serverConfig.google.mailId}`,
    to: emailId.toString(),
    subject: `Welcome ${name}! Verify your account`,
    html: `<div><span style="display:block;margin-left:auto;margin-right:auto"><p>Dear ${name},</p><p>Welcome to PhotoAnnomate! We&#39;re excited to have you as a new user.</p><p>To ensure that your account is secure, we wanted to let you know that we&#39;ll never ask you for personal information or login credentials via email. If you receive any suspicious emails claiming to be from us, please don&#39;t click on any links or download any attachments. Instead, forward the email to PhotoAnnomate&#39;s support team at ${serverConfig.google.mailId} so we can investigate.</p><p>If you have any questions or feedback, please don&#39;t hesitate to reach out to us. We&#39;re here to help you get the most out of PhotoAnnomate.</p></span></div><br><a href=${url} style="width:200px;padding:10px 15px;display:block;margin-left:auto;margin-right:auto;background:#4c649b;color:#fff;text-decoration:none;text-align:center;font-weight:600">Confirm Your Account</a><br/><span><p>Thank you for choosing PhotoAnnomate!</p><p>Best regards,<br />PhotoAnnomate Team</p><span/>`,
  };

  const popularEmailServices = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'yopmail.com'];
// Send the email
const emailDomain = mailOptions.to.split('@')[1];
    if (popularEmailServices.includes(emailDomain)) {
transporter.sendMail(mailOptions, (err, info) => {
  if (err) {
      //console.error('Error sending email:', err);
  } else {
      //console.log('Email sent:', info);
      return info.response
  }
});
}else{
  throw new Error('Provide Valid Email Address, Supported Domains: Gmail, Yahoo, hotmail, outlook ');
}
return "Success";
}

async function sendResetPasswordEmail(emailId, name, code) {
  const transporter = mailer.createTransport({
    host: 'smtp.gmail.com',
    port: serverConfig.google.port,
    secure: true,
    auth: {
        user: serverConfig.google.mailId,
        pass: serverConfig.google.password
    }
});
  const mailOptions = {
    from: serverConfig.google.mailId,
    to: emailId.toString(),
    subject: `Reset Password`,
    html: `<div><span style="display:block;margin-left:auto;margin-right:auto">Dear ${name}, We received a request to reset your password for your account with us. To reset your password, please use the below generated code:</span></div><br><span style="width:200px;padding:10px 15px;display:block;margin-left:auto;margin-right:auto;background:#4c649b;color:#fff;text-decoration:none;text-align:center;font-weight:600">${code}</span><br/><div><span style="text-align:center;display:block;margin-left:auto;margin-right:auto">If you did not request a password reset, please ignore this email. Your account will remain secure.</span></div><br/><span>Best regards,<br/><span><p>Thank you for choosing PhotoAnnomate!</p><p>Best regards,<br />PhotoAnnomate Team</p><span/>`,
  };
  const popularEmailServices = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'yopmail.com'];
  // Send the email
  const emailDomain = mailOptions.to.split('@')[1];
      if (popularEmailServices.includes(emailDomain)) {
  // Send the email
transporter.sendMail(mailOptions, (err, info) => {
  if (err) {
      console.error('Error sending email:', err);
  } else {
     return info.response
  }
});
}else {
  throw new Error('Invalid  Email Address Found');
}
return "Success" ;
}
module.exports = { sendVerificationEmail, sendResetPasswordEmail };
