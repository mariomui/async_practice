$(document).ready(function () {
  var $btn = $('#btn'),
    $list = $('#list');

  var clicks = ASQ.react.of();
  var timer = ASQ.react.of();

  $btn.click(function (evt) {
    clicks.push(evt);
  });
  // $btn.click(throttler(clicker, 3000));
  setInterval(() => {
    timer.push();
  }, 1000);

  var msgs = ASQ.react.zip(clicks, timer);
  msgs.val(() => {
    $list.append('<p>ddd</p>');
  });
  function clicker(evt) {
    // TODO
    console.log(evt);
    $list.append('<p>hi</p>');
  }

  function throttler(fn, threshold) {
    // only allow the five second to allow for a punch.
    let intervalId = null;
    return function (...args) {
      if (!intervalId) {
        fn.apply(args);
      }
      intervalId = setInterval(() => {
        intervalId = null;
        clearInterval(intervalId);
      }, threshold);
    };
  }
  // TODO: setup sampled sequence, populate $list
});
