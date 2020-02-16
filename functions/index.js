var firebase = require('firebase');
require('firebase-functions');

//firebase sdk
const firebaseConfig = require('./util/config');
firebase.initializeApp(firebaseConfig);
//firebase functions
const functions = firebase.functions();

// general imports
const express = require('express');

// express app
const app = express();

// Middleware Setup
// app.use()

// import routes

const authRoute = require('./routes/auth/index');
// const userRoute = require('./functions/routes/user');
// const jobsRoute = require('./functions/routes/jobs');
npm ERR! This is probably not a problem with npm. There is likely additional logging output above.

// use routes

app.use('/', authRoute); // login

// app.use((req, res, next) => {
// 	res.locals.user = req.user;
// 	next();
// });
// app.use('/user', userRoute);

// app.use('/jobs', jobsRoute);
//Users route

exports.api = functions.region('europe-west1').https.onRequest(app);
