(import-all "../function/index.lisp")
(import-all "../list/index.lisp")
(import-all "record-from-entries.lisp")

(export record-select)

(define (record-select p record)
  (pipe record
    record-entries
    (list-select (compose p list-second))
    record-from-entries))
