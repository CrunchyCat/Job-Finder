let mongoose = require('mongoose');

//Job Request Mongoose Schema
module.exports = mongoose.model('job_request', mongoose.Schema({
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
  }
}));