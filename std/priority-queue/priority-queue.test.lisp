(import-all "priority-queue")

(begin
  (= queue (make-priority-queue int-compare/descending))
  (assert-equal null (priority-queue-get "a" queue))
  queue)
