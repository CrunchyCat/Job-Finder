let mongoose = require('mongoose');

//Job Rating Mongoose Schema
module.exports = mongoose.model('Job_rating', mongoose.Schema({
  job_id:{
    type: String,
    required: true
  },
  author:{
    type: String,
    required: true
  },
  rating:{
    type: Number,
    required: true
  }
}));
