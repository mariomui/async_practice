$(document).ready(function () {
  var $btn = $('#btn'),
    $list = $('#list');

  var clicks = ASQ.csp.chan();
  var msgs = ASQ.csp.chan();

  var clicked = null;
  $btn.click(listenToClicks);
  function listenToClicks(evt) {
    if (!clicked) {
      clicked = ASQ.csp.putAsync(clicks, evt);
      clicked.then((e) => {
        clicked = null;
      });
      // you can't drain out a channel.
      // this is a way to keep things easily hot.
    }
  }

  // the clicking thing is the producer of the stream.

  // Hint: ASQ()().runner( .. )
  // create a go routine
  ASQ().runner(
    ASQ.csp.go(function* process0(ch) {
      while (true) {
        const msg = yield ASQ.csp.take(msgs);
        $list.append('<p>sup</p>');
      }
    }),
    // each process is a full atomic.

    ASQ.csp.go(function* process1(ch) {
      // you can put the asterisk anywhere between the function keyword and the variable declaration name
      while (true) {
        //okay each function auto runs the runner.
        yield ASQ.csp.take(clicks);
        yield ASQ.csp.put(msgs, 'clicked!');
        yield ASQ.csp.take(ASQ.csp.timeout(3000));
        // who is doing the runner stuff?
      }
    })
  );
  // TODO: setup sampling go-routine and
  // channel, populate $list
});
