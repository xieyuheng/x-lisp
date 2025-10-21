(define (main)
  (block entry
    (goto print-bool))

  (block print-bool
    (print #t)
    (print #f)
    (goto print-int))

  (block print-int
    (print 0)
    (print 1)
    (print -1)
    (goto print-float))

  (block print-float
    (print 0.0)
    (print 1.0)
    (print -1.0)
    (return)))
