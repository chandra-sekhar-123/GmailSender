const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000; 

// These id's and secrets should come from .env file.
const CLIENT_ID = 'your Client Id';
const CLEINT_SECRET = 'Your Client Secret';
const REDIRECT_URI = 'your redirect uri';
const REFRESH_TOKEN = 'your Refresh token';

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLEINT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function sendMail(mailInfo) {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'Your Email',
        clientId: CLIENT_ID,
        clientSecret: CLEINT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: 'Your Email',
      to: mailInfo.to,
      subject:mailInfo.subject,
      text: 'Hello from gmail email using API',
      html: mailInfo.editorData,
      attachments: [
        {
          filename: 'foodwaylogo.jpg',
          path: 'foodwaylogo.jpg',  
        }
      ]
    };

    const result = await transport.sendMail(mailOptions);
    if(mailInfo.emails){
      mailInfo.emails.foreach(ele=>{
        const mailOptions = {
          from: 'Your Email',
          to:ele,
          subject:mailInfo.subject,
          text: 'Hello from gmail email using API',
          html: mailInfo.editorData,
          attachments: [
            {
              filename: 'foodwaylogo.jpg',
              path: 'foodwaylogo.jpg',  
            }
          ]
        };
        transport.sendMail(mailOptions);
      })
    }
    return result;
  } catch (error) {
    return error;
  }
}
app.use(express.json());

app.use(cors({
  credentials:true,
  origin:["http://localhost:4200"]
}));


app.post('/sendmail', async (req, res) => {
  console.log(req.body);
  try {
    const result = await sendMail(req.body);
    res.send(result);
  } catch (error) {
    res.send(error);
  }
});

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });  