# module

support import `std;`
```scheme
(import "std:graph")
(import "std:graph/index.lisp")
```

# graph

move graph to std

# priority-queue

```scheme
(make-max-priority-queue)
(make-min-priority-queue)

(priority-queue-put! key priority queue)
(priority-queue-get key queue)
(priority-queue-delete! key queue)

(priority-queue-peek queue)
(priority-queue-poll! queue)
(priority-queue-poll-all! queue)
```
