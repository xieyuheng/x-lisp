(define-function (main)
  (block entry
    ;; bool
    (= _ (const #t))
    (call print _)
    (= _ (const #f))
    (call print _)

    ;; int
    (= _ (const 0))
    (call print _)
    (= _ (const 1))
    (call print _)
    (= _ (const -1))
    (call print _)

    ;; float
    (= _ (const 0.0))
    (call print _)
    (= _ (const 1.0))
    (call print _)
    (= _ (const -1.0))
    (call print _)
    (return)))
