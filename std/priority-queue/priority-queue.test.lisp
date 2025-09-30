(import-all "priority-queue")

(begin
  (= queue (make-priority-queue int-compare/descending))
  (assert-equal null (priority-queue-get "a" queue))
  (priority-queue-put! "b" 2 queue)
  (priority-queue-put! "c" 3 queue)
  (priority-queue-put! "a" 1 queue)
  (assert-equal ["c" 3] (priority-queue-poll! queue))
  (assert-equal ["b" 2] (priority-queue-poll! queue))
  (assert-equal ["a" 1] (priority-queue-poll! queue))
  (assert-equal null (priority-queue-poll! queue))
  void)
