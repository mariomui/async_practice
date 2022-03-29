function fakeAjax(url, cb, time = null) {
  var fake_responses = {
    file1: 'The first text',
    file2: 'The middle text',
    file3: 'The last text',
  };
  var randomDelay = (Math.round(Math.random() * 1e4) % 8000) + 1000;

  console.log('Requesting: ' + url);

  setTimeout(
    function () {
      cb(fake_responses[url]);
    },
    time ? time : randomDelay
  );
}

function output(text) {
  console.log(text);
}

// **************************************

function getFile(file, time = null) {
  // this is my thunkConstructor
  // thunk constructor creates thunks
  // thunks create tokens, tokens can be accessed because they are referenced ememory
  // thunk( (functiondefintion) )
  // The inside function is now the thing we need to crate
  // thunk( logic, cb) some combination of that is called and the cb is passed to the time intensive logic
  // what do we do here?

  // what runs first?
  var text = null;
  var cbacker = [];
  var fn = null;
  /*
	i know i need fakeAjax to run first. okay that's done.
	1st scneario, text isn't there.
	2nd scneario, text is there. 
	
	2nd scneario first. run it and hav eit immediably be cbable.
	1st scneario. 1st reqest first, text is null.
	*/
  fakeAjax(
    file,
    function (response) {
      if (fn !== null) {
        fn(response);
      } else {
        text = response;
      }
    },
    time
  );
  return function (cb) {
    if (text === null) {
      // on first token thunk, eventloop is filled with fn1
      fn = cb;
    } else {
      /* the event loop has to be multithreaded.
			because the entire procedure of the code is on the event loop now.
			so we have the timer keep going for fn1, but it's still waiting for 1s i think.
			*/
      cb(text);
    }
  };
}
const thunkTokenOne = getFile('file1', 3000);
const thunkTokenTwo = getFile('file2', 5200);
const thunkTokenThree = getFile('file3', 3000);
const tokens = [thunkTokenOne, thunkTokenTwo, thunkTokenThree];
// in this instance I am recursively doing the callback hell to do this in order.
let i = 0;
const recurseHelper = (tokens) => {
  if (tokens.length === 0) {
    return;
  }
  const token = tokens.pop();
  token((text) => {
    output(text);
    console.log(++i);
    recurseHelper([...tokens]);
  });
};

/*

token(cb1)

inside token we either give cb1 to the ajax async
or we fire cb1. If execution control is given to the ajax async, cb1 in the eventloop
But we've already started our ajax work load so that fits our active thunk.
but if it's in the event loop like, what happens to all the internal functions?
---> because we have our getFileThunkCreators, it pushed the ajax calls and therefore
the setTimout calls to the eventloop in order way early. 

// in this universe
thunkTokenTwo is a function but it is a function with the closure of getFile
and since getFile is a completly new universe, fn and cb are null
we do the same thing as before.
But what happens if we do get the text? 
cb(fires) because it does have the text, but since it's further up the stack, it has to wait?
i always thought the top of the stack has to fire off first? before the bottom does.
oh, because the setTimeout fn is async, that shit gets popped off the stack and sent to the evnet que.
eventloop = [fn1]

recurseHelper(2Tokens)
// ajaxone isn't completed yet, but we rev it up like we are supposed to.
//cb detects that text isn't there yet.
//it gives the completion function the callback, gives the control over to ajax.
token()
recurseHelper(3tokens)
*/

console.log();
recurseHelper(tokens.reverse());
// request all files at once in "parallel"
/*
Requesting: file1
The first text
Requesting: file2
The middle text
Requesting: file3
The last text
*/
function getFuncName(func) {
  return func.constructor.toString();
}

const fulfilled = Array(tokens.length).fill(null);
// for (let [idx, token] of tokens.entries()) {
//   token((text) => {
//     fulfilled[idx] = text;
//     for (let [idx, full] of fulfilled.entries()) {
//       if (full !== null) {
//         if (typeof full === 'string') {
//           console.log(full);
//           fulfilled[idx] = true;
//         }
//       } else {
//         break;
//       }
//     }
//   });
// }

for (let token of tokens) {
  // token(output);
}
// What is a lazy thunk
// What is an active thunk?
// active makes request right away
