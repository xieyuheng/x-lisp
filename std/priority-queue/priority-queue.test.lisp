(import-all "priority-queue")

(begin
  (= queue (make-priority-queue int-compare/descending))
  (assert-equal null (priority-queue-get "a" queue))
  (priority-queue-put! "a" 1 queue)
  (priority-queue-put! "b" 2 queue)
  (assert-equal ["b" 2] (priority-queue-peek queue))
  void)
