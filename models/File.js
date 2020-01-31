const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FileSchema = new Schema({
  oldFile: String,
  newFile: String,
  header: String,
  lines: [String]
});

module.exports = mongoose.model('File', FileSchema);
