(import-all "../function/index.lisp")
(import-all "../list/index.lisp")
(import-all "record-from-entries.lisp")

(define (record-filter p record)
  (pipe record
    record-entries
    (swap list-filter (compose p list-second))
    record-from-entries))
