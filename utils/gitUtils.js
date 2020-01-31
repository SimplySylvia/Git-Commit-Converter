// External Modules
const Git = require('nodegit');
const fs = require('fs');
const db = require('../models');

const getRepo = async (url, name) => {
  try {
    const clonedRepo = await Git.Clone(url, `repos/${name}`);
    // Work with the repository object here.
    console.log(clonedRepo);
    const newRepo = await db.Repo.create({
      name,
      url,
      location: `repos/${name}`
    });
    // console.log(newRepo);
    compileCommits(clonedRepo, newRepo);
  } catch (err) {
    console.log(err);
  }
};

const compileCommits = async (repo, newRepo) => {
  try {
    const firstCommitOnMaster = await repo.getMasterCommit();
    const history = await firstCommitOnMaster.history();
    history.on('end', async commits => {
      for (let i = 0; i < commits.length; i++) {
        const commit = commits[i];
        const generatedCommit = await generateCommit(commit);
        //
        newRepo.commits.push(generatedCommit);
        if (i === commits.length - 1) {
          newRepo.save();
        }
      }
    });

    history.start();
  } catch (err) {
    console.log(err);
  }
};

const generateCommit = async commit => {
  const log = {
    sha: commit.sha(),
    message: commit.message(),
    diffList: []
  };

  const diffList = await commit.getDiff();
  for (let i = 0; i < diffList.length; i++) {
    const diff = diffList[i];
    const patches = await diff.patches();
    for (let j = 0; j < patches.length; j++) {
      const patch = patches[j];
      const hunks = await patch.hunks();
      for (let k = 0; k < hunks.length; k++) {
        const hunk = hunks[k];
        const lines = await hunk.lines();
        log.diffList.push({
          oldFile: patch.oldFile().path(),
          newFile: patch.newFile().path(),
          header: hunk.header().trim(),
          lines: lines.map(
            line => String.fromCharCode(line.origin()) + line.content().trim()
          )
        });
      }
    }
    if (i === diffList.length - 1) {
      return Promise.resolve(log);
    }
  }
};

module.exports = {
  getRepo,
  compileCommits
};
