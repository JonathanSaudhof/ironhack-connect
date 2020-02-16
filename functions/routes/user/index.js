const router = require('express').Router();
const Job = require('../../models/jobs');
const User = require('../../models/user');
var nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

const checkForLogin = (req, res, next) => {
	console.log('-----> check for login');
	if (!req.user) {
		console.log('-----> not logged in');
		res.redirect('/');
		return;
	}
	console.log('-----> logged in');
	next();
};

const checkForActivated = (req, res, next) => {
	console.log('activated?:', req.user.activated);
	if (!req.user.activated) {
		res.render('user/firstLogin', {
			userId: req.user._id,
			layout: false,
			message: `It's your first login. Your have to set your name and password before you can login.`,
		});
		return;
	} else {
		next();
	}
};

const getEmailText = (email, randomPassword) => {
	return `
	<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Welcome to Ironhack Connect </title>
		</head>
		<body>
			<h1> Welcome to Ironhack Connect </h1>
			<p>Please login on <a href="http://ironhack-connect.herokuapp.com"> http://ironhack-connect.herokuapp.com </a>
			<p><b>Using your eMail: </b> ${email}</p>
			<p><b>And this password: </b> ${randomPassword}</p>
		</body>
	</html>`;
};

//node mailer

var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.MAIL_USER,
		pass: process.env.MAIL_PASS,
	},
});

router.use(checkForLogin);
// router.use(checkForActivated);

router.get('/dashboard', checkForActivated, (req, res, next) => {
	console.log('-----> dashboard');
	console.log('-----> User:');

	if (req.user.role === 'admin') {
		// const Promises = [
		//   User.find({ activated: true })
		//     .sort({ activatedAt: -1 })
		//     .limit(3),
		// ];

		User.find({ activated: true })
			.sort({ activated_at: -1 })
			.limit(3)
			.then((userList) => {
				console.log(userList);
				res.render('user/dashboard.hbs', {
					userList: userList,
				});
				return;
			})
			.catch((err) => {
				next(err);
			});
	} else {
		Job.find({})
			.sort({ created_at: -1 })
			.limit(3)
			.then((jobsList) => {
				// res.send(jobs);
				res.render('user/dashboard.hbs', {
					role: req.user.role,
					jobsList: jobsList,
				});
				return;
			})
			.catch((err) => {
				next(err);
			});
	}
});

router.post('/firstLogin/:id', (req, res, next) => {
	console.log('-----> First login Post');
	const userId = req.params.id;
	const { name, lastname, password, confirmPassword } = req.body;

	if (req.user.activated) {
		res.redirect('/');
	}

	if (name === '' || lastname === ' ' || password === '') {
		res.render('user/firstLogin', {
			name,
			lastname,
			layout: false,
			message: 'Indicate username and password',
		});
		return;
	}

	if (password !== confirmPassword) {
		res.render('user/firstLogin', {
			name,
			lastname,
			layout: false,
			message: 'Your password did not match',
		});
		return;
	}

	User.findById(userId).then((userDoc) => {
		console.log('---> user found');
		if (userDoc === null) {
			res.render('user/firstLogin', {
				name,
				lastname,
				layout: false,
				message: 'The username does not exists! Please, contact your admin.',
			});
		}
		// Can be deleted?

		const salt = bcrypt.genSaltSync(bcryptSalt);
		const hashPass = bcrypt.hashSync(password, salt);

		return User.updateOne(
			{ _id: userId },
			{
				password: hashPass,
				activated: true,
				activatedAt: new Date(),
				'profile.name': name,
				'profile.surname': lastname,
			},
		)
			.then((result) => {
				console.log('---> updated & activated User');
				res.redirect('/');
			})
			.catch((err) => {
				next(err);
			});
	});
});

router.get('/favorites', (req, res, next) => {
	User.findById(req.user._id)
		.populate('favJobs')
		.then((userData) => {
			// res.send(userData);
			// return;
			res.render('user/favourites', { jobList: userData.favJobs });
		})
		.catch((err) => next(err));
});

router.post('/addFavourites', (req, res) => {
	//var query = req.body.favJobs;
	User.findByIdAndUpdate(req.user._id, { $addToSet: { favJobs: req.body.id } })
		.then((data) => {
			DataTransfer;

			console.log(data);
		})
		.catch((err) => {
			console.log(err);
		});
});

router.get('/create', (req, res, next) => {
	if (req.user.role === 'admin') {
		console.log('---> Create User allowed');

		res.render('user/createUser');
		return;
	}

	console.log('---> Create User Not allowed');
	res.redirect('/user/dashboard');
});
router.post('/create', (req, res, next) => {
	if (req.user.role === 'admin') {
		console.log('---> Post Create User');
		console.log({ ...req.body });

		const { email, role, opt } = req.body;

		if (opt != 'on') {
			res.render('user/createUser', {
				email,
				role,
				message: 'Please confirm !',
			});
			return;
		}

		User.findOne({ email: email })
			.then((user) => {
				console.log('foundUser:', user);
				if (user !== null) {
					res.render('user/createUser', {
						email,
						role,
						message: 'User already exists',
					});
					return;
				}

				if (user === null) {
					const randomPassword = Math.random()
						.toString(36)
						.slice(-8);
					const salt = bcrypt.genSaltSync(bcryptSalt);
					const hashPass = bcrypt.hashSync(randomPassword, salt);

					User.create({ email: email, role: role, password: hashPass })
						.then((user) => {
							// write an email with the password
							const emailText = getEmailText(email, randomPassword);

							let mailOptions = {
								from: 'Ironhack.connect',
								to: email,
								subject: 'Welcome to Ironhack.Connect',
								html: emailText,
							};

							return transporter.sendMail(mailOptions, function(error, info) {
								if (error) {
									console.log(error);
								} else {
									console.log('Email sent: ' + info.response);
								}
								('jonathan@jonathansaudhof.de');
							});
						})
						.then((result) => {
							res.redirect('/user/dashboard');
							return;
						})
						.catch((err) => next(err));
				} else {
				}
			})
			.catch((err) => next(err));

		return;
	}

	console.log('---> Create User Not allowed');
	res.redirect('/user/dashboard');
});

router.get('/:id', (req, res, next) => {
	const userId = req.params.id;
	const visitorId = req.user._id;
	console.log('---> User profile of: ', userId);
	User.findById(userId).then((user) => {
		let allowed = user._id.toString() === visitorId.toString() ? true : false;
		if (req.user.role === 'admin') {
			allowed = true;
		}

		console.log(allowed, user._id, visitorId);
		res.render('user/profile', { member: user, allowed });
		return;
	});
});

router.get('/:id/edit', (req, res, next) => {
	res.render('user/editProfile');
});
router.post('/:id/edit', (req, res, next) => {
	const {
		name,
		surname,
		course,
		batchMonth,
		portfolio,
		batchYear,
		jobTitle,
		company,
		companyUrl,
		startDate,
	} = req.body;

	const updateUser = {
		profile: {
			name,
			surname,
			course,
			portfolio,
			batch: { month: batchMonth, year: batchYear },
			cv: [
				{
					jobTitle,
					company,
					companyUrl,
					startDate,
				},
			],
		},
	};

	User.findById(req.user._id)
		.then((docsToMerge) => {
			console.log(docsToMerge);
			const mergedUserProfile = {
				...docsToMerge.profile,
				...updateUser.profile,
			};
			return User.findOneAndUpdate(
				{ _id: req.user._id },
				{ $set: { profile: mergedUserProfile } },
			);
		})
		.then((result) => {
			res.redirect(`/user/${req.user._id}`);
		})
		.catch((err) => {
			next(err);
		});

	//
	//   .then((result) => {
	//     res.redirect(`/user/${req.user._id}`);
	//   })
	//   .catch((err) => next(err));
	// // const updatedUser = { name };
});

router.post('/deleteStack', (req, res, next) => {
	const { category } = req.body;

	User.findByIdAndUpdate(req.user._id, {
		$pull: { 'profile.techStack': { category: category } },
	})
		.then((result) => console.log(result))
		.catch((err) => next(err));
});
router.post('/addStack', (req, res, next) => {
	const { category, rate } = req.body;

	User.findByIdAndUpdate(req.user._id, {
		$push: { 'profile.techStack': { category: category, rate: rate } },
	})
		.then((result) => console.log(result))
		.catch((err) => next(err));
});
module.exports = router;
