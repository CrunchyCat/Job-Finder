const express = require('express');
const router = express.Router();

let Job_rating = require('../models/job_rating'); //Job Rating Model

//Add Job Rating
router.post('/add/:id', function(req, res) {
  if (!req.params.id)
    res.status(500).send();

  req.checkBody('rating','Rating is required').notEmpty();

  //Get Errors
  let errors = req.validationErrors();
  if (errors)
    req.flash('error','Rating was not selected');
    res.redirect('/listings/' + req.params.id);

  let job_rating = new Job_rating();
  job_rating.job_id = req.params.id;
  job_rating.author = req.user._id;
  job_rating.rating = req.body.rating;

  job_rating.save(function(err) {
    if (err) {
      console.log(err);
      return;
    } else {
      req.flash('success','Job Rating Added');
    }
  });
});

module.exports = router;