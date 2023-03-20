const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "ludwig0@ethereal.email", // generated ethereal user
    pass: "Kjm97bqhpcvqgDqayK", // generated ethereal password
  },
});

module.exports = transporter ;
