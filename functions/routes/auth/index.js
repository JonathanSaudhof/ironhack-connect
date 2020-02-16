const express = require('express');
const router = express.Router();

//validators
const isEmail = (email) => {
	const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if (email.match(regEx)) return true;
	else return false;
};

const isEmpty = (string) => {
	if (string.trim() === '') return true;
	else return false;
};

const validateLoginData = (data) => {
	let errors = {};
	//if
	if (isEmpty(data.email)) errors.email = 'Must not be empty';
	if (isEmpty(data.password)) errors.password = 'Must not be empty';

	return {
		errors,
		valid: Object.keys(errors).length === 0 ? true : false,
	};
};

// login
// login GET

router.get('/login', (req, res, next) => {
	const { email, password } = req.body;

	const user = { email, password };

	const { valid, errors } = validateLoginData(user);
	if (!valid) return res.status(400).json(errors);

	firebase
		.auth()
		.signInWithEmailAndPassword(user.email, user.password)
		.then((data) => {
			return data.user.getIdToken();
		}).then((token)=> {
      return.res.json({token})
    })
		.catch((err) => {
			console.error(err);
			return res
				.status(403)
				.json({ general: 'Wrong credentials, please try again' });
		});
});

// login POST
// the post request calls passport.authenticate and
router.post('/login', (req, res) => {
	//no passport anymore. firebase does the job
	/* passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/login',
		failureFlash: true,
		passReqToCallback: true,
  }), */
});

router.get('/logout', (req, res) => {
  // we need to logout here
  firebase.auth().signOut().then(function() {
    // Sign-out successful.
  }).catch(function(error) {
    // An error happened.
  });
});

//createUser , just for admins ==> other route

module.exports = router;
