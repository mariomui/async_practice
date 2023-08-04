# TOC

- [TOC](#toc)
- [Overall Thoughts On Async Concurrency](#overall-thoughts-on-async-concurrency)
  - [Ultra Learning](#ultra-learning)
    - [Practice](#practice)
  - [Concepts](#concepts)
    - [What Are Generators?](#what-are-generators)
    - [Concurrency vs Parallelism (WIP)](#concurrency-vs-parallelism-wip)
    - [Hot and Cold Observables (WIP)](#hot-and-cold-observables-wip)
    - [Back Pressure](#back-pressure)
    - [Async Patterns](#async-patterns)
      - [What is Reactive Programming?](#what-is-reactive-programming)
      - [What is STM (WIP)](#what-is-stm-wip)
      - [What is CSP?](#what-is-csp)
      - [What is Actors? (WIP)](#what-is-actors-wip)
  - [Facts](#facts)
  - [Know the Past, Know your future](#know-the-past-know-your-future)
    - [Description](#description)
  - [Regarding Observables](#regarding-observables)
  - [NOTE TO SELF (WIP)](#note-to-self-wip)

# Overall Thoughts On Async Concurrency

## Ultra Learning

### Practice

* Practicing All Forms of Async Using Best Resources
  * Readme:
    * Links right now just go to my practice area, i will link to the actual course online once i make a link shortener
  * My Practice Links
    * [Kyle Simpsons Async course on FEM: Generators](<https://replit.com/@yi_kankan/generator#readme.md>)
    * [Kyle Simpsons Async course on FEM: Promises](<https://replit.com/@yi_kankan/promsies>)
    * [Programming With Alex: Monads](<https://replit.com/@yi_kankan/monads#index.ts>)
    * [Observables with rxjs](http://reactivex.io/learnrx/)

## Concepts

### What Are Generators?

* Further information
  * See folder:ex_8-generators for a step by step guide
*

### Concurrency vs Parallelism (WIP)

### Hot and Cold Observables (WIP)

* Definition:
  * Observables are lazy.
    * they only produce data when they are subscribed to.
  * Two subscribers or consumers to a cold observable cannot reliably obtain the same piece of data when the Observable is cold.
  * A Hot Observable will push the same data to all subscribers at the same time reliably.
* Why is this important?
  * No clue. :)

### Back Pressure

* Description:
  * without a direct connection, provide a signal from the consumer to producer, either to start or stop streaming.
  * using the channel or transport road between two parties to communicate information needed for cooperations.
  * spooky action at a distance.
* Why is this useful?
  * It allows decoupling the consumer and the producer for faster processing when we use the channel as the intermediary for their cooperation.
  * Squeezing the tube increases pressure on the channel, this pressure, eventually reaches the producer.
    * single connection, multiple uses.
    * the act of subscribing to the observable/producer creates the channel.

### Async Patterns

#### What is Reactive Programming?

* Definition:
  * a pattern of providing the observable data the mechanisms to schedule notifications to the observer so that the observer can fire business logic.
* Technology:
  * RXJS Observables
  * Monads
* Why is it different or better?
  * clear boundaries between data and consumption of data
  * truly reactive

#### What is STM (WIP)

* Definition:
  * Software Transactional Memory
  * This is probably an Actor Model.
* Why is this important
  * Rust supports both an async_channel and a sync_channel

#### What is CSP?

* Definition:
  * Communicating sequential processes (synchronous processes)
  * Uses blocking techniques to send and receive messages between two or more processes
* Why is this important?
  * Multiple machines/threads running your code
    * decoupled send and receiving logic.
    * GO uses this.
      * I've never seen server process more requests faster than CSP. Out of the box. No tweaking.
    * Clojurescript uses this
      * so this is why i'm so attracted to cljs. huh.
      * this would be pretty good for datalake stuff.
* TLDR:
  * using generators, you create two or more yield environments, and the channel activates .next or .pause depending on pub/sub logic.
* Modeling concurrency with channels

#### What is Actors? (WIP)

* Definition:
  * Communicating sequential processes (asynchronous processes)

## Facts

* rxjs marbles
* google everything. lol.

## Know the Past, Know your future

### Description

* The problems you face today are the problems ppl have faced before
* How is this problem historically dealt with?
  * ES5
    * Looping
    * thunks
      * i hate this word.
      * I'm gonna call it the thunder-source pattern
        * thunder-clapper
          * houses the callback that retrieves the thunderclap for side effect work.
            *
              ```javascript
                th1((thunderclap) => {
                  ...
                  thc2(thunderclap) => {
                    ...
                  }
                })
              ```
        * thunderer creates the thunder-clapper
          * thunderer creates the thunder.
          * we want to thunder early! So we can receive the thunder-clap asap
          * thunderer has to worry about the logic of the thunder-clapper

* ES5
  * No promises, no async await, no generators
  * Techniques:
    * looping
      * terrible looking code
    * thunking
      * still callback hell
      * still too much control over to the web-apis
        * no intermediary queue to handle web-api results
* ES6
  * 2015
  * Promises Introduced
  * generators introduced
    * and therefore async await
  * Techniques
    * Promise chaining
      * promise chain hell
    * generators
      * funky looking but powerful
    * async await
      * powerful, removes callback hell
      * uses promises as a queue manager.
  * Recommendations:
    * use generators for customized data manipulation
    * use async await 99% of the time.
  * Problems
    * Working with state
      * when working with continuously streaming data, you will eventually reach a point where someone is hitting your machine with a lot of requests. You can queue it up but it might interfere with your state in weird ways when you have an advanced ping pong match with 8 people.
      * cancellable events?
        * ever tried making a cancellable REST api request ?
        * or a cancellable state action creator?
          * middleware with thunks
            * way complicated

----

Why not just Observables for everything and skip async await?
90% of things are streams of data and might require cancellation?

* What is async await?
  * There are generators
* What are generators
  * They are coroutines
* What are coroutines?
  * Coroutines are routines that queue up time intensive chores so that they are in the proper order
* Can you explain this in terms I understand?
  * Async await solves the problem of queueing up TICs
  * Example 1A in plain english:
    * Boss: I need the team to do my chores.
    * Team: okay, We have 3 ppl.
    * Boss: Great...
      * boss: Alvin, go get me a sandwich from downstairs
      * boss: Simon, go to the airport and buy me a airplane ticket.
      * boss: Theodore, buy me a movie ticket.
        * Team: Can't we do this on our phone?
    * Boss: No and I want you to hand your receipts in the order I asked you to as fast as you can. If Simon gets back late, Theodore, you need to await him. IN order. And as fast as you can.
    * Team: *groan*
  * Example 1A in abstracted mapped talk
    * Fetch 3 pieces of data
      * the team must take time to do the chores.
    * If fetch1 arrives first, apply logic immediately
      * logic can be a console out
      * Alvin has to give his receipt first if he comes back from his chore first.
    * if fetch1 arrives late, we have to wait for it before logic can be applied.
      * if Alvin is late, Simon cannot hand his receipt first, he has to wait for it.
      * the logic/notification, in this case, is handing the receipt to the boss.
    * the initiation of fetch2 and fetch3 must still happen
      * Alvin, Simon, and Theodore must set out do their chores at the same time.
  * Example 1A in concrete talk using generators
    * You create a link to a memory
    * In this memory is a function
      *
        ```js
        const generator = function* generator() {
          ...code...
          yield [chore1]
          yield [chore2]
        }
        const iterator = generator()
        ```
    * what does calling generator do?
    * It only points the iterator to the memory.
      * it does not execute any code inside the generator.
    * What does calling iterator.next() do?
      * It will execute code all the way up to the yield.
      * It will then stop and wait for a value.
    * How do i pass a value to chore1?
      * On the first iterator.next, if you pass any value, it is meaningless
      * On the second iterator.next, you can do iterator.next(3)
        * this will pass the number 3
    * What's the point?
      * We can start TIC earlier in the code, but apply logic to them in order. Maybe Simon requires Alvin to sign his receipt before handing it in.
      * TIC that are independent on each other can have LOGIC applied to them that is dependent. Maybe the sandwich is special, and allows the Boss to regain his eyesight so he can actually see the airplane ticket.
    * How does it work practically in code?
      * you eventually want to just list a bunch of chores, the logic for each one in the same generator.
      * your ultimate goal is to call the next function in the chore itself.
        * i want Alvin to notify Simon when Alvin has the sandwich.
        * i want Simon to notify Theodore when Simon has the ticket.
        * etc
      * So the chore itself, does the next-ing.
        * The problem here is you want Alvin to wait till his sandwich is given to the boss before notifying Simon.
        * And in JS , starting the fetch early, means its synchronous. Alvin wont understand not to notify Simon. he's a chipmunk for crying out loud.
        * You can invert control over to a web-api.
          * handing it over to a queueing service ensures that things happen in a timely order.
          * Except you are handing over control and things might hiccup.
          * It's also global. So anything else calling the setTimeout will interfere. Anything on the callstack will interfere.
          * The code sucks.
          * setTimeout(fn, 0)
            * i've done this a lot as a 2nd year engineering worker so don't feel bad. I'm dumb too.
          * in cs , this is called inversion of control.
      * How can we do the next-ing intelligently and local to the generator function?
        * Use Promises.
        * Instead of yield Chore1
          * yield PromiseChore1
          * aka yield Receipt
        * Only when the promise resolves does the next function fire.
          * this is how async await works. await is yield.
          * That's why await requires a promise.
          * That's why async returns a promise.
            * see `prom + genv2.js` to see a vanilla implementation of generators.

## Regarding Observables

* Observables are Monads.
* Monads are far easier if you remove Categorical theory and math from it. We already work with Monads. We just don't know it.

## NOTE TO SELF (WIP)

* My brain isn't suited for multithreading.
* I don't like dealing with bugs
* What's the point of learning multithread and multiprocessing code when single thread has so many techniques?
* Focusing on single threaded techniques first, and then use multiple computers as message queue systems to do multi process scaling seems awesome to me.
* [ ] service workers
* [ ] exercise10
  * [ ] convert all these exercises to actual rxjs
