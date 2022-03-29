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
// The old-n-busted callback way

function getFile(file) {
  return new Promise(function (resolve) {
    fakeAjax(file, resolve);
  });
}

const promises = [
  getFile('file1'),
  getFile('file2'),
  getFile('file3'),
  Promise.resolve('complete'),
];

// promises.reduce((accum, p) => {
//   return accum.then(() => p).then(output);
// }, Promise.resolve());
// Request all files at once in
// "parallel" via `getFile(..)`.
//
// Render as each one finishes,
// but only once previous rendering
// is done.

// ???

// i should call this like ks does.
/*
accum being chain is a much nicer term.
also be name explicit is kindah good.
*/
//having a map reduce is best because then yo ustart from pure data
promises
  .reduce(function combine(chain, promise) {
    // over here we name it cuz it's so close to the top , it's a cb but
    // fully utilized by us. imperatively controlling it.
    return chain
      .then(function () {
        return promise; // over here you can use a lambda because it is an inverted callback.
      })
      .then(output);
  }, Promise.resolve())
  .then(() => {
    output('oh you can dod this too. hrm');
  });
