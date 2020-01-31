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
  // Open the master branch.
  const firstCommitOnMaster = await repo.getMasterCommit();
  // Create a new history event emitter.
  const history = await firstCommitOnMaster.history();
  // Listen for commit events from the history.
  history.on('commit', async commit => {
    console.log('----COMMIT----');
    const generatedCommit = await generateCommit(commit);
    //
    fs.writeFile(
      'output.json',
      JSON.stringify(generatedCommit),
      'utf8',
      function(err) {
        if (err) {
          console.log('An error occured while writing JSON Object to File.');
          return console.log(err);
        }
        console.log('JSON file has been saved.');
      }
    );
  });

  // Start emitting events.
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
  diffList.forEach(async diff => {
    const patches = await diff.patches();
    patches.forEach(async patch => {
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
    });
  });
  return Promise.resolve(log);
};
