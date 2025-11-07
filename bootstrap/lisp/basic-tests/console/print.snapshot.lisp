(define-function main
  (block entry
    ;; bool
    (= _ (const #t))
    (call print _)
    (call newline)
    (= _ (const #f))
    (call print _)
    (call newline)

    ;; int
    (= _ (const 0))
    (call print _)
    (call newline)
    (= _ (const 1))
    (call print _)
    (call newline)
    (= _ (const -1))
    (call print _)
    (call newline)

    ;; float
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
