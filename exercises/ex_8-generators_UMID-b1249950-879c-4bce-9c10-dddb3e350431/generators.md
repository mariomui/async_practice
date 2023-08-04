---
UMID: UMID-b1249950-879c-4bce-9c10-dddb3e350431
---

# Instructions

1. You'll do the same thing as the previous exercise(s), but now you should use asynquence and a generator.

2. Expected behavior:
- Request all 3 files at the same time (in "parallel").
- Render them ASAP (don't just blindly wait for all to finish loading)
- BUT, render them in proper (obvious) order: "file1", "file2", "file3".
- After all 3 are done, output "Complete!".

## Notes On Generators

```js
// step 2 couRoutine gets invoked
function coRoutine(gen) {
  // step 3 generator created iterator.
  const itern = gen();
  return function (...args) {
    return itern.next.apply(itern, args)
  }
}
// step1 coRoutine runs
const nexter = coroutine(function *gen() {
  let x = yield promFetch().then(nexter)
  // step 5: only `let x =` is executed
  // everything right of yield is paused.
  // but the value to the right of yield is returned to the invoking next {value: Promise: done: false}
  // step 7, the promFetch has a then attached that next the next value. This continues the function

  return x;
 // step 8
  // at any point we do a return from a generator
  // we send out the x value and a done: true
  // { value: x, done: true }
})
//step 4 iterator is called.
const genned = nexter()
// step 6 nexter() holds a promise since promFetch() is right after yield.
// step 9 genned is returned the value
// {value: boom , done: true}

console.log(genned)

function promFetch() {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res('boom')
    }, 1000)
  })
}
```
