# MARIO NOTES

* An defined array of actionable fetches helps with optimistic rendering
  * A list helps with:
    * examples
      * best case:
        * when file1 is handled first, and file2 and file3 is not in response
          * file1 will output and exit@handleResponse:file2
        * when file2 or file3 is handled first, other fiels are not in response
          * handleResponse@file2|3 will exit first because file1 content !exit
        * when file2@handled and now file1 is handling
          * file1 will ouptut and continue on to file2 .
        * When file3@handled and now file1 is handling
          * file1 will output and continue only to exit because file 2 does not exist
        * When file2@handled and now file1 is handleing
          * the loop will exit at the nonexistent 3.

* So Promise.all is the simpler method that I did in the first implementation with the two arrays.
* The Promise recommended by Kyle is interesting.
  * It's like a custom promise.optimisticallyLazy
  * If you could structure a set of endpoints such as
  * ```js
    const list = Promise.ordinalLazy([ep1, ep2, ep3])
    list.map(cb1,cb2,cb3);
    ```
    Now there's a chance of really quick speed if the first ep1 returns really fast.
