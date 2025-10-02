(export optional?)

(define (optional? p x)
  (or (p x)
      (null? x)))
