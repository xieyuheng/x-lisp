(export
  digraph?
  digraph-edge?
  make-empty-digraph
  make-digraph
  digraph-vertices
  digraph-vertex-count
  digraph-empty?
  digraph-add-vertex!
  digraph-has-vertex?
  digraph-add-vertices!
  digraph-direct-successors
  digraph-direct-predecessors
  digraph-out-degree
  digraph-in-degree
  digraph-add-edge!
  digraph-add-edges!
  digraph-has-edge?
  digraph-direct-successor?
  digraph-direct-predecessor?
  digraph-edges
  digraph-edge-count
  digraph-delete-edge!
  digraph-delete-vertex!
  digraph-successor?
  digraph-predecessor?)

(define-data (digraph? V)
  (cons-digraph
   (vertex-set (set? V))
   (direct-successor-hash (hash? V (set? V)))
   (direct-predecessor-hash (hash? V (set? V)))))

(define (digraph-edge? V) (tau V V))

(define digraph-vertex-set cons-digraph-vertex-set)
(define digraph-direct-successor-hash cons-digraph-direct-successor-hash)
(define digraph-direct-predecessor-hash cons-digraph-direct-predecessor-hash)

(claim make-empty-digraph
  (polymorphic (V) (-> (digraph? V))))

(define (make-empty-digraph)
  (cons-digraph (@set) (@hash) (@hash)))

(claim make-digraph
  (polymorphic (V)
    (-> (list? V) (list? (digraph-edge? V))
        (digraph? V))))

(define (make-digraph vertices edges)
  (= digraph (make-empty-digraph))
  (digraph-add-vertices! vertices digraph)
  (digraph-add-edges! edges digraph)
  digraph)

(claim digraph-vertices
  (polymorphic (V)
    (-> (digraph? V)
        (list? V))))

(define digraph-vertices
  (compose set-to-list digraph-vertex-set))

(claim digraph-vertex-count
  (polymorphic (V)
    (-> (digraph? V)
        int?)))

(define digraph-vertex-count
  (compose list-length digraph-vertices))

(claim digraph-empty?
  (polymorphic (V)
    (-> (digraph? V)
        bool?)))

(define digraph-empty?
  (compose (equal? 0) digraph-vertex-count))

(claim digraph-add-vertex!
  (polymorphic (V)
    (-> V (digraph? V)
        (digraph? V))))

(define (digraph-add-vertex! vertex digraph)
  (= vertex-set (digraph-vertex-set digraph))
  (set-add! vertex vertex-set)
  (= direct-predecessor-hash (digraph-direct-predecessor-hash digraph))
  (unless (hash-has? vertex direct-predecessor-hash)
    (hash-put! vertex {} direct-predecessor-hash))
  (= direct-successor-hash (digraph-direct-successor-hash digraph))
  (unless (hash-has? vertex direct-successor-hash)
    (hash-put! vertex {} direct-successor-hash))
  digraph)

(claim digraph-has-vertex?
  (polymorphic (V)
    (-> V (digraph? V)
        bool?)))

(define (digraph-has-vertex? vertex digraph)
  (= vertex-set (digraph-vertex-set digraph))
  (set-member? vertex vertex-set))

(claim digraph-add-vertices!
  (polymorphic (V)
    (-> (list? V) (digraph? V)
        (digraph? V))))

(define (digraph-add-vertices! vertices digraph)
  (list-each (swap digraph-add-vertex! digraph) vertices)
  digraph)

(claim digraph-direct-successors
  (polymorphic (V)
    (-> V (digraph? V)
        (set? V))))

(define (digraph-direct-successors vertex digraph)
  (hash-get vertex (digraph-direct-successor-hash digraph)))

(claim digraph-direct-predecessors
  (polymorphic (V)
    (-> V (digraph? V)
        (set? V))))

(define (digraph-direct-predecessors vertex digraph)
  (hash-get vertex (digraph-direct-predecessor-hash digraph)))

(claim digraph-out-degree
  (polymorphic (V)
    (-> V (digraph? V)
        int?)))

(define (digraph-out-degree vertex digraph)
  (set-size (digraph-direct-successors vertex digraph)))

(claim digraph-in-degree
  (polymorphic (V)
    (-> V (digraph? V)
        int?)))

(define (digraph-in-degree vertex digraph)
  (set-size (digraph-direct-predecessors vertex digraph)))

(claim digraph-add-edge!
  (polymorphic (V)
    (-> (digraph-edge? V) (digraph? V)
        (digraph? V))))

(define (digraph-add-edge! [source target] digraph)
  (digraph-add-vertex! source digraph)
  (digraph-add-vertex! target digraph)
  (set-add! target (digraph-direct-successors source digraph))
  (set-add! source (digraph-direct-predecessors target digraph))
  digraph)

(claim digraph-add-edges!
  (polymorphic (V)
    (-> (list? (digraph-edge? V)) (digraph? V)
        (digraph? V))))

(define (digraph-add-edges! edges digraph)
  (list-each (swap digraph-add-edge! digraph) edges)
  digraph)

(claim digraph-has-edge?
  (polymorphic (V)
    (-> (digraph-edge? V) (digraph? V)
        bool?)))

(define (digraph-has-edge? [source target] digraph)
  (and (digraph-has-vertex? source digraph)
       (digraph-has-vertex? target digraph)
       (set-member? target (digraph-direct-successors source digraph))))

(claim digraph-direct-successor?
  (polymorphic (V)
    (-> V V (digraph? V)
        bool?)))

(define (digraph-direct-successor? target source digraph)
  (digraph-has-edge? [source target] digraph))

(claim digraph-direct-predecessor?
  (polymorphic (V)
    (-> V V (digraph? V)
        bool?)))

(define (digraph-direct-predecessor? source target digraph)
  (digraph-has-edge? [source target] digraph))

(claim digraph-edges
  (polymorphic (V)
    (-> (digraph? V)
        (list? (digraph-edge? V)))))

(define (digraph-edges digraph)
  (pipe (digraph-vertices digraph)
    (list-map (swap digraph-direct-successors digraph))
    (list-zip (digraph-vertices digraph))
    (list-lift
     (lambda ([vertex successors])
       (pipe successors
         set-to-list
         (list-map (lambda (successor) [vertex successor])))))))

(claim digraph-edge-count
  (polymorphic (V)
    (-> (digraph? V)
        int?)))

(define (digraph-edge-count digraph)
  (list-length (digraph-edges digraph)))

(claim digraph-delete-edge!
  (polymorphic (V)
    (-> (digraph-edge? V) (digraph? V)
        (digraph? V))))

(define (digraph-delete-edge! [source target] digraph)
  (when (digraph-has-edge? [source target] digraph)
    (set-delete! target (digraph-direct-successors source digraph))
    (set-delete! source (digraph-direct-predecessors target digraph)))
  digraph)

(claim digraph-delete-vertex!
  (polymorphic (V)
    (-> V (digraph? V)
        (digraph? V))))

(define (digraph-delete-vertex! vertex digraph)
  (when (digraph-has-vertex? vertex digraph)
    (pipe (digraph-direct-successors vertex digraph)
      (set-each
       (lambda (successor)
         (digraph-delete-edge! [vertex successor] digraph))))
    (pipe (digraph-direct-predecessors vertex digraph)
      (set-each
       (lambda (predecessor)
         (digraph-delete-edge! [predecessor vertex] digraph))))
    (hash-delete! vertex (digraph-direct-successor-hash digraph))
    (hash-delete! vertex (digraph-direct-predecessor-hash digraph))
    (set-delete! vertex (digraph-vertex-set digraph)))
  digraph)

(claim digraph-predecessor?
  (polymorphic (V)
    (-> V V (digraph? V)
        bool?)))

(define (digraph-predecessor? source target digraph)
  (or (digraph-direct-predecessor? source target digraph)
      (list-any?
       (lambda (predecessor) (digraph-predecessor? source predecessor digraph))
       (set-to-list (digraph-direct-predecessors target digraph)))))

(claim digraph-successor?
  (polymorphic (V)
    (-> V V (digraph? V)
        bool?)))

(define (digraph-successor? target source digraph)
  (digraph-predecessor? source target digraph))
