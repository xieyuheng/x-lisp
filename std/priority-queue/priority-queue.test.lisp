(import-all "priority-queue")

(begin
  (= queue (make-priority-queue int-compare/descending))
  queue)
