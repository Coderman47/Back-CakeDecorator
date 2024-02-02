const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const { HOST_BACK, HOST_FRONT } = require("./index");
require("dotenv");

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

async function sendMessageMail(email, name, verifyLink) {
  const contentHTML = `
  <h1 align="center">¡Bienvenido/a ${name}!</h1> 
  <h2 align="center">🧁¿Cómo te va? Es un placer conocerte!🍰</h2>
  <h3 align="center">
  ¡Estoy muy pero muy contenta de que te hayas registrado en mi aplicación!
  </h3>
  <h3 align="center">SOLO TE FALTA UN PASO MÁS 👉<a href=${HOST_BACK}/users/verifyAccount?id=${verifyLink}>VERIFICAR CUENTA</a>👈</h3>
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
      from: '"¡ÚLTIMO PASO!" <elmundodulcenotificaciones@gmail.com>',
      to: email,
      subject: "Verifica tu cuenta en El Mundo Dulce de Marite App✔️",
      html: contentHTML,
    };
    const finalResult = transporter.sendMail(
      //TRANSPORT DATA
      mailOptions,
      (err, info) => {
        err
          ? console.log("ERROR MAILER", err)
          : console.log("INFO MAILER", info.messageId);
      }
    );
    return finalResult;
  } catch (error) {
    console.log(error.message);
  }
}

async function sendMailToRecoveryPass({ email, name, id }) {
  // console.log("EMAIL",{email, name})
  const contentHTML = `
  <h1 align="center">¡Hola ${name}!👋</h1> 
  <h2 align="center">Sigue este enlace para generar una nueva contraseña y no perder tu cuenta</h2>
  <h3 align="center"><a href=${HOST_FRONT}/generateNewPass/${id}>💥HAZ CLICK AQUÍ💥</a></h3>
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
      from: '"Administración" <elmundodulcenotificaciones@gmail.com>',
      to: email,
      subject: "Nueva contraseña para tu cuenta en Mundo Dulce de Marite",
      html: contentHTML,
    };
    const finalResult = transporter.sendMail(
      //TRANSPORT DATA
      mailOptions,
      (err, info) => {
        err
          ? console.log("ERROR MAILER", err)
          : console.log("INFO MAILER", info.messageId);
      }
    );
    return finalResult;
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = {
  sendMessageMail,
  sendMailToRecoveryPass,
};
