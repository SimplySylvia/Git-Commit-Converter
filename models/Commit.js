const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const File = require('./File');

const CommitSchema = new Schema({
  sha: String,
  message: String,
  diffList: [File.schema]
});

module.exports = mongoose.model('Commit', CommitSchema);
