(import group-t "group.lisp")

(define trivial-group
  (new group-t
    (define element-t trivial-t)
    (define compose (lambda (x y) sole))
    (define compose-associative (lambda (x y z) refl))
    (define id sole)
    (define id-left (lambda (x) refl))
    (define id-right (lambda (x) refl))
    (define inverse (lambda (x) sole))
    (define inverse-left (lambda (x) refl))
    (define inverse-right (lambda (x) refl))))

trivial-group:compose
(trivial-group:compose sole)
(trivial-group:compose sole sole)

(group-div trivial-group)
(group-div trivial-group sole)
(group-div trivial-group sole sole)
