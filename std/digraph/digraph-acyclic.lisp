(import-all "digraph")

(export
  digraph-topological-order
  digraph-topological-ordered?
  digraph-acyclic?)

(claim digraph-topological-order
  (polymorphic (V)
    (-> (digraph? V)
        (list? V))))

(define (digraph-topological-order digraph)
  (= queue (digraph-zero-dependency-vertices digraph))
  (kahn-algorithm (digraph-copy digraph) queue []))

(define (digraph-zero-dependency-vertices digraph)
  (pipe (digraph-vertices digraph)
    (list-select (compose (equal? 0) (swap digraph-in-degree digraph)))))

(claim digraph-topological-ordered?
  (polymorphic (V)
    (-> (list? V) (digraph? V)
        bool?)))

(define (digraph-topological-ordered? vertices digraph)
  (match vertices
    ([] true)
    ((cons first rest)
     (and (pipe rest
            (list-all?
             (lambda (vertex)
               (not (digraph-predecessor? vertex first digraph)))))
          (digraph-topological-ordered? rest digraph)))))

(claim digraph-acyclic?
  (polymorphic (V)
    (-> (digraph? V)
        bool?)))

(define (digraph-acyclic? digraph)
  )

(claim kahn-algorithm
  (polymorphic (V)
    (-> (digraph? V) (list? V) (list? V)
        (list? V))))

(define (kahn-algorithm digraph queue ordered)
  (cond ((list-empty? queue) ordered)
        (else
         (= vertex (list-shift! queue))
         (list-push! vertex ordered)
         (digraph-delete-vertex! vertex digraph)
         (pipe (digraph-zero-dependency-vertices digraph)
           (list-reject (swap list-member? queue))
           (list-each (swap list-push! queue)))
         (kahn-algorithm digraph queue ordered))))
