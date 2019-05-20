let mongoose = require('mongoose');

//Job Listing Mongoose Schema
module.exports = mongoose.model('Job_listing', mongoose.Schema({
  title:{
    type: String,
    required: true
  },
  author:{
    type: String,
    required: true
  },
  desc:{
    type: String,
    required: true
  },
  pay:{
    type: String,
    required: false
  },
  address:{
    type: String,
    required: false
  }
}));