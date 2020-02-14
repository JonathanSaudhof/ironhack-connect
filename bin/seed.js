const mongoose = require('mongoose');
require('dotenv').config();
const promises = [];

// Mongoose connect
mongoose.connect(process.env.MONGODB_URI, () => {
	console.log('connected to DB for seed');
});

// USER - Seeds
const User = require('../models/user');
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

const salt = bcrypt.genSaltSync(bcryptSalt);
const hashPass = bcrypt.hashSync('1234', salt);

const defaultUser = [
	//admin
	{
		email: 'admin@example.com',
		role: 'admin',
		password: hashPass,
	},
	//user1
	{
		email: 'user1@example.com',
		password: hashPass,
		profile: {
			// has to start with https:// | http:// AND end with .*** :
			course: 'WebDev',
			batch: {
				month: 'January',
				year: 2020,
			},
			// minor important attributes
			image: '/images/profile/no-image.jpg',

			techStack: [
				{
					category: 'Javascript',
					rate: 3,
				},
				{
					category: 'HTML/CSS',
					rate: 3,
				},
				{
					category: 'FriendlineSS',
					rate: 3,
				},
			],
			searchFor: 'full time job',
		},
	},
	//moderator
	{
		email: 'moderator@example.com',
		role: 'moderator',
		password: hashPass,
	},
];
User.collection.drop();

promises.push(
	User.create(defaultUser).then((result) => {
		console.log(result);
	}),
);

// JOB-Seeds
// TODO: Create the jobsSeed
const defaultJobs = [{}];

// Wait for all Promisses and close the connection afterwards

Promise.all(promises).then((result) => {
	User.collection.drop();
	console.log('Seeds finished');
	mongoose.connection.close();
});
