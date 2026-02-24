(export square)

(claim square (-> int-t int-t))

(define (square x)
  (imul x x))
