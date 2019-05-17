const express = require('express');
const router = express.Router();

let Job_listing = require('../models/job_listing'); //Job Listing Model
let Job_rating = require('../models/job_rating'); //Job Rating Model
let User = require('../models/user'); //User Model

//Add Route
router.get('/add', ensureAuthenticated, function(req, res) {
  res.render('add_job_listing', {
    title: 'Create Job Listing'
  });
});

//Add Job Listing
router.post('/add', function(req, res) {
  req.checkBody('title','Title is required').notEmpty();
  req.checkBody('desc','Description is required').notEmpty();

  //Get Errors
  let errors = req.validationErrors();
  if (errors)
    res.render('add_job_listing', {
      title: 'Create Job Listing',
      errors: errors
    });
  else {
    let job_listing = new Job_listing();
    job_listing.title = req.body.title;
    job_listing.author = req.user._id;
    job_listing.desc = req.body.desc;
    job_listing.pay = req.body.pay;
    job_listing.address = req.body.address;
    //Images will probably have to be saved here

    job_listing.save(function(err) {
      if (err) {
        console.log(err);
        return;
      } else {
        req.flash('success','Job Listing Added');
        res.redirect('/listings/');
      }
    });
  }
});

//Edit Job Listing Form
router.get('/edit/:id', ensureAuthenticated, function(req, res) {
  Job_listing.findById(req.params.id, function(err, job_listing) {
    if (job_listing.author != req.user._id) {
      req.flash('danger', 'Not Authorized');
      res.redirect('/listings/');
    }
    res.render('edit_job_listing', {
      title: 'Edit Job Listing',
      job_listing: job_listing
    });
  });
});

//Edit Job Listing
router.post('/edit/:id', function(req, res) {
  let job_listing = {};
  job_listing.title = req.body.title;
  job_listing.desc = req.body.desc;
  job_listing.pay = req.body.pay;
  job_listing.address = req.body.address;
  //Images will probably have to be updated here

  Job_listing.updateOne({_id: req.params.id}, job_listing, function(err) {
    if (err) {
      console.log(err);
      return;
    } else {
      req.flash('success', 'Job Listing Updated');
      res.redirect('/listings/');
    }
  });
});

//Delete Job Listing
router.delete('/:id', function(req, res) {
  if (!req.user._id)
    res.status(500).send();

  Job_listing.findById(req.params.id, function(err, job_listing) {
    if (job_listing.author != req.user._id)
      res.status(500).send();
    else {
      job_listing.remove({_id: req.params.id}, function(err) {
        if (err)
          console.log(err);
        res.send('Success');
      });
    }
  });
});

//Get Job Listing
router.get('/:id', function(req, res) {
  Job_listing.findById(req.params.id, function(err, job_listing) {
    let actual_job = Object.assign({}, job_listing._doc);
    var query = { job_id: actual_job._id.toString()};
    Job_rating.find(query, function(err, ratings) {
      if (err)
        console.log(err);
      else
        var total_rating = 0;
        let rating_authors = [];
        ratings.forEach(function(rating) {
          total_rating = total_rating + rating.rating;
          rating_authors.push(rating.author);
        });
        avg_rating = null;
        if (ratings.length > 0) {
          avg_rating = total_rating / ratings.length;
        }
        actual_job.rating = avg_rating;

        let hasUserVoted = false;
        User.findById(job_listing.author, function(err, job_author) {
          if (err)
            console.log(err);
          else
            // did the user vote already?
            if (req.user)
              rating_authors.forEach(function(author_id) {
                if (req.user.id == author_id)
                  hasUserVoted = true;
              });

            res.render('job_listing', {
              job_listing: actual_job,
              author: job_author.name,
              hasVoted: hasUserVoted
            });
        });
    });
  });
});

//Access Control
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated())
    return next();
  else {
    req.flash('danger', 'Please Login');
    res.redirect('/users/login');
  }
}

module.exports = router;