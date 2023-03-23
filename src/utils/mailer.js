const nodemailer = require("nodemailer");
const { google } = require("googleapis");
require("dotenv");

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

async function sendMessageMail(email, name) {
  const contentHTML = `
                <h1>¡Bienvenida ${name}!</h1> 
                <h2>🧁¡Hola!¿Cómo estás?🍰</h2>
<p>
Estoy muy contenta de que te hayas registrado en mi app!. 
Solamente debo pedirte que hagas click en este link >dejar-link< 
para finalizar el proceso de verfificación de tu cuenta.
</p>
  `;
  try {
    const accessToken = await oAuth2Client.getAccessToken();
    // console.log("TOKEN USER",accessToken)
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
      from: '"Remitente" <elmundodulcenotificaciones@gmail.com>',
      to: email,
      subject: "Verifica tu cuenta en El Mundo Dulce de Marite App✔️",
      html: contentHTML,
    };
    const finalResult = await transporter.sendMail(
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
