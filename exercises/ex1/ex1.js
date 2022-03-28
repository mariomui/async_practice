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

function output(text, a = '') {
  console.log(text, a);
}

// **************************************
// The old-n-busted callback way

const executionListByFilename = [];
const futureContents = [];
/**
 * The plan is to keep a list of execution. file1 is executed before file2
 * Once that list is executed, i keep a seperate list called futureContents
 * Once futureLengths is completely filed, then i output futureContents.
 * The problem here is that I don't optimistically render.
 * if the first getFile luckily happens to enter first, it won't render first.
 * The rendering happens at the length of the longest time.
 *
 */
function _getFileV1(file) {
  executionListByFilename.push(file);
  fakeAjax(file, function (text) {
    const idx = executionListByFilename.findIndex((item) => file === item);
    futureContents[idx] = text;
    const truelength = futureContents.filter((a) => !!a).length;
    if (truelength === executionListByFilename.length) {
      output(futureContents);
    }
  });
}

/**
 * The plan is to keep a list of execution. file1 is executed before file2
 * Once that list is executed, i keep a seperate list called futureContents
 * if the first getFile luckily happens to enter first, it will render first cuz i am looping through the executionList on each success callback.
 * if the 2nd file isnt there, the loop breaks.
 * But there's a chance that
 *
 */
const response = {};
let n = 0;

function handleResponse(file, text) {
  // if file is in response supply it with text
  const executionListByFilename = ['file1', 'file2', 'file3'];
  const isFileInResponse = typeof response[file] !== 'undefined';
  if (!isFileInResponse) {
    response[file] = text;
  }
  for (let [idx, filename] of executionListByFilename.entries()) {
    if (filename in response) {
      /* 
			combining conditions here is a classic mistake. People dont like
			nested ifs but that's stupid. Try combining conditions here! the program 
			will fail hard. The filename if in response will sometimes be marked as
			outputted. Then you want to iterate to the next filename, not return.
			Using 'if (A & B)', however, would not iter when a filename has been flagged when outputted.
			Instead, the function would exit too early. 
			*/
      if (typeof response[filename] === 'string') {
        output(response[filename], ++n);
        if (executionListByFilename.length === idx + 1) {
          output('complet3e');
        }
        response[filename] = true;
      }
    } else {
      return;
    }
  }
}
function _getFileV2(file) {
  // executionListByFilename.push(file);
  // this won't work, you might have different states of execution lists at each successful callback
  fakeAjax(file, function (text) {
    handleResponse(file, text);
  });
}

const getFile = _getFileV2;
// request all files at once in "parallel"
getFile('file1');
getFile('file2');
getFile('file3');
