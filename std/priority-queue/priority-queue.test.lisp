(import-all "priority-queue")

(begin
  (= queue (make-priority-queue int-compare/descending))

  (assert (priority-queue-empty? queue))
  (assert-equal 0 (priority-queue-length queue))

  (assert-equal null (priority-queue-get "a" queue))
  (assert-equal null (priority-queue-get "b" queue))
  (assert-equal null (priority-queue-get "c" queue))

  (priority-queue-put! "b" 2 queue)
  (priority-queue-put! "c" 3 queue)
  (priority-queue-put! "a" 1 queue)

  (assert-not (priority-queue-empty? queue))
  (assert-equal 3 (priority-queue-length queue))

  (assert-equal 1 (priority-queue-get "a" queue))
  (assert-equal 2 (priority-queue-get "b" queue))
  (assert-equal 3 (priority-queue-get "c" queue))

  (assert-equal "c" (priority-queue-peek queue))

  (priority-queue-put! "a" 10 queue)
  (assert-equal "a" (priority-queue-peek queue))

  (priority-queue-put! "b" 20 queue)
  (assert-equal "b" (priority-queue-peek queue))

  (priority-queue-put! "a" 1 queue)
  (assert-equal "b" (priority-queue-peek queue))

  (priority-queue-put! "b" 2 queue)
  (assert-equal "c" (priority-queue-peek queue))

  (assert-equal "c" (priority-queue-poll! queue))
  (assert-equal "b" (priority-queue-poll! queue))
  (assert-equal "a" (priority-queue-poll! queue))
  (assert-equal null (priority-queue-poll! queue))

  (assert-equal null (priority-queue-get "a" queue))
  (assert-equal null (priority-queue-get "b" queue))
  (assert-equal null (priority-queue-get "c" queue)))

(begin
  (= queue (make-priority-queue int-compare/descending))

  (priority-queue-put! "b" 2 queue)
  (priority-queue-put! "c" 3 queue)
  (priority-queue-put! "a" 1 queue)

  (assert-equal 1 (priority-queue-get "a" queue))
  (assert-equal 2 (priority-queue-get "b" queue))
  (assert-equal 3 (priority-queue-get "c" queue))

  (assert-equal "c" (priority-queue-peek queue))

  (priority-queue-delete! "c" queue)
  (assert-equal "b" (priority-queue-peek queue))

  (priority-queue-delete! "a" queue)
  (assert-equal "b" (priority-queue-peek queue))

  (priority-queue-delete! "b" queue)
  (assert-equal null (priority-queue-peek queue)))
