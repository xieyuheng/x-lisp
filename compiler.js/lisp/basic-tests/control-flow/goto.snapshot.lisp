(define-function main
  (block entry
    (goto print-bool))

  (block print-bool
    (= _ (const #t))
    (call print _)
    (call newline)
    (= _ (const #f))
    (call print _)
    (call newline)
    (goto print-int))

  (block print-int
    (= _ (const 0))
    (call print _)
    (call newline)
    (= _ (const 1))
    (call print _)
    (call newline)
    (= _ (const -1))
    (call print _)
    (call newline)
    (goto print-float))

  (block print-float
    (= _ (const 0.0))
    (call print _)
    (call newline)
    (= _ (const 1.0))
    (call print _)
    (call newline)
    (= _ (const -1.0))
    (call print _)
    (call newline)
    (return)))
