const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Commit = require('./Commit');

const RepoSchema = new Schema({
  name: { type: String, required: [true, 'Name is required.'] },
  url: { type: String, required: [true, 'Url is required.'] },
  location: String,
  commits: [Commit.schema]
});

module.exports = mongoose.model('Repo', RepoSchema);
