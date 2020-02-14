/*Profile view*/

const express = require('express');
const router = express.Router();
const Job = require('../../models/jobs');

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

router.use(checkForLogin);

/*Add new Jobs*/

router.get('/', (req, res) => {
	console.log('add new route');
	res.render('job/dashboard');
});

router.get('/new', (req, res) => {
	console.log('add new route');
	res.render('job/addNewJob');
});

router.post('/', (req, res, next) => {
	console.log({ ...req.body });
	let image = '';

	switch (req.body.category) {
		case 'Data':
			image = '/images/da.svg';
			break;
		case 'UX/UI':
			image = '/images/ux.svg';
			break;
		case 'WebDev':
			image = '/images/wd.svg';
			break;
		case '':
			image = '/images/loudspeaker.png';
			break;
	}

	Job.create({ ...req.body, image: image, author: req.user._id })
		.then((createdJob) => {
			// res.send(createdJob);
			res.redirect(`jobs/${createdJob._id}`);
		})
		.catch((err) => {
			next(err);
		});

	// Job.create({
	//   title: res.body.title,
	//   company: res.body.company,
	//   companyUrl: res.body.companyUrl,
	//   description: res.body.description,
	//   contractType: res.body.contractType,
	//   industry: res.body.industry,
	//   category: res.body.category,
	//   location: res.body.location,
	//   author: res.body.author,
	//   startsAt: res.body.startsAt,
	// })
	//   .then((createdJob) => {
	//     res.redirect('/jobs/${createdJob._id}');
	//   })
	//   .catch((err) => {
	//     next(err);
	//   });
});

/*Job details*/
router.get('/:id', (req, res) => {
	console.log('Hello');

	const jobId = req.params.id;
	const userId = req.user._id;
	// userId --> req.user._id
	// Job.author._id -->
	Job.findById(jobId)
		.populate('author')
		.then((JobInfo) => {
			console.log(JobInfo);

			if (
				JobInfo._id.toString() === userId.toString() ||
				req.user.role === 'admin'
			) {
				const j = JobInfo.toString();

				res.render('job/jobPage.hbs', {
					jobInfo: JobInfo,
					allowed: true,
					notOwner: jobId !== userId,
				});
				return;
			}

			res.render('job/jobPage.hbs', { jobInfo: JobInfo });
		})
		.catch((err) => {
			next(err);
		});
});

/*Delete Jobs*/
router.get('/:id/delete', (req, res) => {
	Job.deleteOne({ _id: req.params.id })
		.then(() => {
			res.render('job/deleted.hbs');
			// res.redirect('/jobs');
		})
		.catch((err) => {
			next(err);
		});
});
/*Edit Jobs*/

router.get('/:id/edit', (req, res, next) => {
	Job.findById(req.params.id)
		.then((jobDocuments) => {
			res.render('job/jobsEdit.hbs', jobDocuments);
		})
		.catch((err) => {
			next(err);
		});
});

router.post('/:id', (req, res, next) => {
	const {
		title,
		companyUrl,
		description,
		contractType,
		category,
		location,
	} = req.body;
	Job.updateOne(
		{ _id: req.params.id },
		{
			title,
			companyUrl,
			description,
			contractType,
			category,
			location,
		},
	)
		.then(() => {
			res.redirect(`/jobs/${req.params.id}`);
		})
		.catch((err) => {
			next(err);
		});
});

/*Job search*/

router.get('/jobs-search/queries', (request, response) => {
	const userInput = new RegExp(request.query.job, 'i');
	Job.find({
		$or: [
			{ title: userInput },
			{ description: userInput },
			{ companyUrl: userInput },
			{ industry: userInput },
			{ category: userInput },
		],
	})
		.sort({ created_at: -1 })
		.then((data) => {
			//console.log("recieved data:", data);
			console.log(data);
			if (data.length === 0) {
				response.render('job/dashboard.hbs', {
					message: 'No results for your search',
				});
				return;
			}

			response.render('job/dashboard.hbs', { jobSearchList: data });
		})
		.catch((err) => console.log('an errror occured', err));
});

module.exports = router;
