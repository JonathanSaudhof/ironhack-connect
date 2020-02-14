require('dotenv').config();
const nodemailer = require('nodemailer');

const testHtml = `<html lang="en">
                      <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Welcome to Ironhack Connect </title>
                      </head>
                      <body>
                        <h1> Welcome to Ironhack Connect </h1>
                        <p> Please login on <a href="http://ironhack-connect.herokuapp.com"> http://ironhack-connect.herokuapp.com </a>
                        <p><b>This eMail: </b> TEST</p>
                        <p><b>Password: </b> TEST</p>´
                      </body>
                      </html>`;

console.log(process.env.MAIL_USER, process.env.MAIL_PASS);
var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.MAIL_USER,
		pass: process.env.MAIL_PASS,
	},
});
var mailOptions = {
	from: 'Ironhack.connect',
	to: 'jonathan@jonathansaudhof.de',
	subject: 'test',
	html: testHtml,
};

transporter.sendMail(mailOptions, function(error, info) {
	if (error) {
		console.log(error);
	} else {
		console.log('Email sent: ' + info.response);
	}
});
