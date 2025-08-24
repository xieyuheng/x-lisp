(import-all "../list/index.lisp")
(import-all "record-from-entries.lisp")

(define (record-filter record p)
  (pipe record
    record-entries
    (lambda (entries)
      (list-filter entries (lambda (entry) (p (car (cdr entry))))))
    ;; (swap list-filter (lambda (entry) (p (car (cdr entry)))))
    ;; (swap list-filter (lambda (entry) (p (list-second entry))))
    ;; (swap list-filter (compose p list-second))
    record-from-entries))
