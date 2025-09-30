[prelude] `sort/` setup
[prelude] sort-order

sort-order?
sort-order-reverse
sort-order-negate
sort-order-before?
sort-order-same?
sort-order-after?

# priority-queue

compare-priority

```scheme
(priority-queue?)
(min-priority-queue?)
(max-priority-queue?)

(make-min-priority-queue)
(make-max-priority-queue)

(priority-queue-put! key priority queue)
(priority-queue-get key queue)
(priority-queue-delete! key queue)

(priority-queue-peek queue)
(priority-queue-poll! queue)
(priority-queue-poll-all! queue)
```
