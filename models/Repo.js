const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Commit = require('./Commit');

const RepoSchema = new Schema({
  name: String,
  url: String,
  location: String,
  commits: [Commit.schema]
});

module.exports = mongoose.model('Repo', RepoSchema);
