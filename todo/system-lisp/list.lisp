(define-struct node-t
  (prev node-t)
  (next node-t)
  (value object-t))

(define-struct (node-t V)
  (prev (node-t V))
  (next (node-t V))
  (value V))
