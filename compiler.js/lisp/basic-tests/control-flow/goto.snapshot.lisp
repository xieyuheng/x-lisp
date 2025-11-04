(define (main)
  (block entry
    (goto print-bool))

  (block print-bool
    (= _ (const #t))
    (call print _)
    (= _ (const #f))
    (call print _)
    (goto print-int))

  (block print-int
    (= _ (const 0))
    (call print _)
    (= _ (const 1))
    (call print _)
    (= _ (const -1))
    (call print _)
    (goto print-float))

  (block print-float
    (= _ (const 0.0))
    (call print _)
    (= _ (const 1.0))
    (call print _)
    (= _ (const -1.0))
    (call print _)
    (return)))
