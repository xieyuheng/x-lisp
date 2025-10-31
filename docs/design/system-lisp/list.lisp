(define-struct (node-t A)
  (prev (optional (node-t A)))
  (next (optional (node-t A)))
  (value A))

(define-struct (list-t A)
  (first (optional (node-t A)))
  (last (optional (node-t A)))
  (cursor (optional (node-t A)))
  (length int-t)
  (free-fn (optional (-> A void-t)))
  (equal-fn (optional (-> A A bool-t)))
  (copy-fn (optional (-> A A))))

(claim new-list (polymorphic (A) (-> (list-t A))))

(define (new-list)
  (new list-t :length 0))

(claim list-free (polymorphic (A) (-> (list-t A) void-t)))

(define (list-destroy self)
  (list-purge self)
  (free self))

(claim list-purge (polymorphic (A) (-> (list-t A) void-t)))

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
