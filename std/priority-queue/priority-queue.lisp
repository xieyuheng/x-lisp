(export
  )

(define-data (priority-queue? K)
  (cons-priority-queue
   (priorities (hash? K int?))))
