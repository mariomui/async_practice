function fakeAjax(url, cb) {
  var fake_responses = {
    file1: 'The first text',
    file2: 'The middle text',
    file3: 'The last text',
  };
  var randomDelay = (Math.round(Math.random() * 1e4) % 8000) + 1000;

  console.log('Requesting: ' + url);

  setTimeout(function () {
    cb(fake_responses[url]);
  }, randomDelay);
}

function output(text) {
  console.log(text);
}

// **************************************

function getFile(file) {
  return new Promise((resolve, reject) => {
    fakeAjax(file, resolve);
  });
}
const [p1, p2, p3] = [getFile('file1'), getFile('file2'), getFile('file3')];

// p1.then(output).then(() => {
//   p2.then(output).then(() => {
//     p3.then(output);
//   });
// });

// request all files at once in "parallel"
// ???
// this is just as ugly as thunks.

p1.then(output)
  .then(() => p2)
  .then(output)
  .then(() => p3)
  .then(output)
  .then(() => {
    console.log('complete');
  });
/*
Kyle simpsons method is much more readable
i should really throw wawy any code i dont think is readable. Or spend some more time reshaping it.
but how does this handle error stuff? I think i prefer actual customizable monads such as observables.
*/
