const mongoose = require("mongoose");

const lectureSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  link: { type: String},
 
});


const LectureModel = mongoose.model("Lecture", lectureSchema);

module.exports = LectureModel;