const mongoose = require('mongoose');
require('dotenv').config();
const promises = [];

// Mongoose connect
mongoose.connect(process.env.MONGODB_URI, () => {
	console.log('connected to DB for seed');
});

// USER - Seeds
const User = require('../models/user');
const Job = require('../models/jobs');
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
const defaultJobs = [
	{
		title: 'Junior UX/UI Designer',
		company: 'Amazon',
		companyUrl: 'https://amazon.com	',
		description: `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.`,
		contractType: 'Full time',
		category: 'UX/UI',
		location: {
			city: 'Seatle',
			country: 'USA',
		},

		image: '/images/ux.svg',
	},
	{
		title: 'Junior Data Scientist ',
		company: 'Zalando',
		companyUrl: 'https://zalando.de	',
		description: `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.`,
		scription: 'You will be working in an awesome team.',
		contractType: 'Full time',
		category: 'Data',
		location: {
			city: 'Berlin',
			country: 'Germany',
		},

		image: '/images/da.svg',
	},
	{
		title: 'Junior Full Stack Developer',
		company: 'Google',
		companyUrl: 'https://google.com	',
		description: `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.`,
		contractType: 'Full time',
		category: 'WebDev',
		location: {
			city: 'Seatle',
			country: 'USA',
		},
		image: '/images/wd.svg',
	},
];
Job.collection.drop();

promises.push(
	Job.create(defaultJobs).then((result) => {
		console.log(result);
	}),
);

// Wait for all Promisses and close the connection afterwards

Promise.all(promises).then((result) => {
	console.log('Seeds finished');
	mongoose.connection.close();
});
