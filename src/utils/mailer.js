const nodemailer = require("nodemailer");
const { google } = require("googleapis");
require("dotenv");

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

async function sendMessageMail(email, name, verifyLink) {
  const contentHTML = `
  <h1>¡Bienvenida ${name}!</h1> 
  <h2>🧁¿Cómo estás?🍰</h2>
  <h3>
  ¡Estoy muy contenta de que te hayas registrado en mi aplicación!
  Solo te falta un paso: <a href=${verifyLink}>VERIFICAR CUENTA</a>
  </h3>
  `;
  try {
    const accessToken = await oAuth2Client.getAccessToken();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      secure: false, // true solo para 465, false para los demas puertos
      auth: {
        type: "OAuth2",
        user: "elmundodulcenotificaciones@gmail.com",
        clientId: oAuth2Client.CLIENT_ID,
        clientSecret: oAuth2Client.CLIENT_SECRET,
        refreshToken: oAuth2Client.REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });
    const mailOptions = {
      from: '"¡ULTIMO PASO!" <elmundodulcenotificaciones@gmail.com>',
      to: email,
      subject: "Verifica tu cuenta en El Mundo Dulce de Marite App✔️",
      html: contentHTML,
    };
    const finalResult = transporter.sendMail(
      //TRANSPORT DATA
      mailOptions,
      (err, info) => {
        err ? console.log(err) : console.log(info.messageId);
      }
    );
    return finalResult;
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = {
  sendMessageMail,
};
