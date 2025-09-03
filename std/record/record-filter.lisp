(import-all "../function/index.lisp")
(import-all "../list/index.lisp")
(import-all "record-from-entries.lisp")

(export record-filter)

(define (record-filter p record)
  (pipe record
    record-entries
    (list-filter (compose p list-second))
    record-from-entries))
