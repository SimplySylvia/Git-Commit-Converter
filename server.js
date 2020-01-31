/* --- Modules --- */
// external modules
const express = require('express');
const bodyparser = require('body-parser');
// internal modules
const utils = require('./utils');
const db = require('./models');
// instanced module
const app = express();

/* --- Middeware --- */
app.use(bodyparser.json());

/* --- Routes --- */
app.get('/api/v1/repos', async (req, res) => {
  try {
    const allRepos = await db.Repo.find({});
    return res.json({ data: allRepos });
  } catch (err) {
    console.log(err);
    return res.json({ err });
  }
});

app.post('/api/v1/repos', async (req, res) => {
  try {
    const repo = await utils.git.getRepo(req.body.url, req.body.name);
    res.json({ data: repo });
  } catch (err) {
    return res.json({ err });
  }
});

app.get('/api/v1/repos/:id', async (req, res) => {
  try {
    const foundRepo = await db.Repo.findById(req.params.id);
    return res.json({ data: foundRepo });
  } catch (err) {
    return res.json({ err });
  }
});

app.listen(4000, () => {
  console.log('listening on port 4000');
});

// utils.git.getRepo('https://github.com/DaltonHart/Test-Repo.git', 'Test-Repo');
