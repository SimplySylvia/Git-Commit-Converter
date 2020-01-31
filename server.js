// External Modules
const Git = require('nodegit');

// Git.Clone(
//   'https://github.com/DaltonHart/awesome-dotfiles.git',
//   'repos/awesome'
// ).then(repository => {
//   // Work with the repository object here.
//   console.log(repository);
// });

// Git.Repository.open('repos/awesome')
//   // Open the master branch.
//   .then(function(repo) {
//     return repo.getMasterCommit();
//   }) // Display information about commits on master.
//   .then(function(firstCommitOnMaster) {
//     // Create a new history event emitter.
//     var history = firstCommitOnMaster.history();

//     // Listen for commit events from the history.
//     history.on('commit', function(commit) {
//       // Show the commit sha.
//       console.log('commit ' + commit.sha());

//       // Store the author object.
//       var author = commit.author();

//       // Display author information.
//       console.log('Author:\t' + author.name() + ' <' + author.email() + '>');

//       // Show the commit date.
//       console.log('Date:\t' + commit.date());

//       // Give some space and show the message.
//       console.log('\n    ' + commit.message());

//       commit.getDiff().then(diffList => {
//         // Give some space and show the dif.
//         console.log('----DIFF----');
//         diffList.forEach(diff => {
//           diff.patches().then(patches => {
//             patches.forEach(patch => {
//               patch.hunks().then(hunks => {
//                 hunks.forEach(hunk => {
//                   hunk.lines().then(lines => {
//                     console.log(
//                       'diff',
//                       patch.oldFile().path(),
//                       patch.newFile().path()
//                     );
//                     console.log(hunk.header().trim());
//                     lines.forEach(line => {
//                       console.log(
//                         String.fromCharCode(line.origin()) +
//                           line.content().trim()
//                       );
//                     });
//                   });
//                 });
//               });
//             });
//           });
//         });
//       });
//     });

//     // Start emitting events.
//     history.start();
//   });

const openRepo = async location => {
  const repo = await Git.Repository.open(location);
  // Open the master branch.
  const firstCommitOnMaster = await repo.getMasterCommit();
  // Create a new history event emitter.
  const history = await firstCommitOnMaster.history();
  // Listen for commit events from the history.
  history.on('commit', async commit => {
    const log = {
      sha: commit.sha(),
      message: commit.message(),
      diffList: []
    };
    const diffList = await commit.getDiff();
    // Give some space and show the dif.
    if (commit.sha() === '58d9f89c13f1f7e5c5836b969490c85dab8992f1') {
      console.log('----DIFF----');
      diffList.forEach(async diff => {
        const patches = await diff.patches();
        patches.forEach(async patch => {
          patch.hunks().then(hunks => {
            hunks.forEach(async hunk => {
              const lines = await hunk.lines();

              log.diffList.push({
                oldFile: patch.oldFile().path(),
                newFile: patch.newFile().path(),
                header: hunk.header().trim()
              });
              console.log(log);
              // lines.forEach(line => {
              //   console.log(
              //     String.fromCharCode(line.origin()) + line.content().trim()
              //   );
              // });
            });
          });
        });
      });
    }
  });

  // Start emitting events.
  history.start();
};

openRepo('repos/awesome');
