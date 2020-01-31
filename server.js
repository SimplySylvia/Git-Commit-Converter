// External Modules
const Git = require('nodegit');
const fs = require('fs');

// Git.Clone(
//   'https://github.com/DaltonHart/awesome-dotfiles.git',
//   'repos/awesome'
// ).then(repository => {
//   // Work with the repository object here.
//   console.log(repository);
// });

const openRepo = async location => {
  const repo = await Git.Repository.open(location);
  const firstCommitOnMaster = await repo.getMasterCommit();
  const history = await firstCommitOnMaster.history();
  history.on('commit', async commit => {
    const generatedCommit = await generateCommit(commit);
    //
    fs.readFile(`./${location}/output.json`, (err, data) => {
      if (err) {
        fs.writeFile(
          `./${location}/output.json`,
          JSON.stringify({ name: location }, null, 2),
          'utf8',
          err => {
            if (err) console.log(err);
          }
        );
        data = JSON.stringify({ name: location });
      }

      const json = JSON.parse(data);
      json[commit.sha()] = generatedCommit;
      fs.writeFile(
        `./${location}/output.json`,
        JSON.stringify(json, null, 2),
        'utf8',
        err => {
          if (err) {
            console.log('An error occured while writing JSON Object to File.');
            return console.log(err);
          }
          console.log('JSON file has been saved.');
        }
      );
    });
  });

  history.start();
};

openRepo('repos/awesome');

const generateCommit = async commit => {
  const log = {
    sha: commit.sha(),
    message: commit.message(),
    diffList: []
  };
  //
  const diffList = await commit.getDiff();
  for (let i = 0; i < diffList.length; i++) {
    const diff = diffList[i];
    const patches = await diff.patches();
    for (let j = 0; j < patches.length; j++) {
      const patch = patches[j];
      const hunks = await patch.hunks();
      hunks.forEach(async hunk => {
        const lines = await hunk.lines();
        log.diffList.push({
          oldFile: patch.oldFile().path(),
          newFile: patch.newFile().path(),
          header: hunk.header().trim(),
          lines: lines.map(
            line => String.fromCharCode(line.origin()) + line.content().trim()
          )
        });
      });
    }
  }

  return Promise.resolve(log);
};
