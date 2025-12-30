(define-struct (node-t A)
  (prev (node-t A))
  (next (node-t A))
  (value A))

(define-struct (list-t A)
  (first (node-t A))
  (last (node-t A))
  (cursor (node-t A))
  (length int-t)
  (free-fn (-> A void-t))
  (equal-fn (-> A A bool-t))
  (copy-fn (-> A A)))

(claim make-list
  (polymorphic (A)
    (-> (list-t A))))

(define (make-list)
  (= self (allocate (size-of list-t)))
  (list-put-length! self 0)
  self)

(claim list-free
  (polymorphic (A)
    (-> (list-t A) void-t)))

(define (list-destroy self)
  (list-purge self)
  (free self))

(claim list-purge
  (polymorphic (A)
    (-> (list-t A) void-t)))

(define (list-purge self)
  (= node (list-first self))
  (while (not (null? node))
    (= next (node-next node))
    (unless (null? (list-free-fn self))
      ((list-free-fn self) (node-value node)))
    (free node)
    (= node next))
  (list-put-first! null self)
  (list-put-last! null self)
  (list-put-cursor! null self)
  (list-put-length! 0 self))
