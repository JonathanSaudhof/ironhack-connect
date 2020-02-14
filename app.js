require('dotenv').config();

// general imports
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');
const moment = require('moment');

//authentication imports
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');

mongoose
	.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
	.then((x) => {
		console.log(
			`Connected to Mongo! Database name: "${x.connections[0].name}"`,
		);
	})
	.catch((err) => {
		console.error('Error connecting to mongo', err);
	});

const app_name = require('./package.json').name;
const debug = require('debug')(
	`${app_name}:${path.basename(__filename).split('.')[0]}`,
);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.use(
	require('node-sass-middleware')({
		src: path.join(__dirname, 'public'),
		dest: path.join(__dirname, 'public'),
		sourceMap: true,
	}),
);

const hbs = exphbs.create({
	extname: 'hbs',
	defaultLayout: 'main',
	/* layoutsDir: path.resolve(__dirname, 'views/layouts' */
	helpers: {
		equal: function(attribute1, attribute2, options) {
			console.log(typeof attribute1, typeof attribute2);
			if (attribute1 === attribute2) {
				console.log('---> is equal');
				return options.fn(this);
			}
		},
		formatDate: function(datetime, format) {
			const DateFormats = {
				short: 'DD MMMM - YYYY',
				long: 'dddd DD.MM.YYYY HH:mm',
			};
			if (moment) {
				// can use other formats like 'lll' too
				format = DateFormats[format] || format;
				return moment(datetime).format(format);
			} else {
				return datetime;
			}
		},
	},
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// default value for title local
app.locals.title = 'Ironhack-Connect';

app.use(
	session({
		secret: 'irongenerator',
		resave: true,
		saveUninitialized: true,
		store: new MongoStore({ mongooseConnection: mongoose.connection }),
	}),
);
app.use(flash());
require('./passport')(app);

const index = require('./routes/index');
const authRoute = require('./routes/auth/index');
app.use('/', index);
app.use('/', authRoute); //
app.use((req, res, next) => {
	res.locals.user = req.user;
	next();
});
const userRoute = require('./routes/user');
app.use('/user', userRoute);

const jobsRoute = require('./routes/jobs');
app.use('/jobs', jobsRoute);
//Users route
module.exports = app;
