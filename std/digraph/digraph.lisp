(export
  digraph?
  digraph-edge?
  make-empty-digraph
  digraph-vertices
  digraph-vertex-count
  digraph-empty?
  digraph-add-vertex!
  digraph-has-vertex?
  digraph-add-vertices!
  digraph-direct-predecessors
  digraph-direct-successors
  digraph-add-edge!
  digraph-add-edges!)

(define-data (digraph? V)
  (cons-digraph
   (vertex-set (set? V))
   (direct-predecessor-hash (hash? V (set? V)))
   (direct-successor-hash (hash? V (set? V)))))

(define (digraph-edge? V) (tau V V))

(define digraph-vertex-set cons-digraph-vertex-set)
(define digraph-direct-predecessor-hash cons-digraph-direct-predecessor-hash)
(define digraph-direct-successor-hash cons-digraph-direct-successor-hash)

(claim make-empty-digraph
  (polymorphic (V) (-> (digraph? V))))

(define (make-empty-digraph)
  (cons-digraph (@set) (@hash) (@hash)))

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

(claim digraph-direct-predecessors
  (polymorphic (V)
    (-> V (digraph? V)
        (set? V))))

(define (digraph-direct-predecessors vertex digraph)
  (hash-get vertex (digraph-direct-predecessor-hash digraph)))

(claim digraph-direct-successors
  (polymorphic (V)
    (-> V (digraph? V)
        (set? V))))

(define (digraph-direct-successors vertex digraph)
  (hash-get vertex (digraph-direct-successor-hash digraph)))

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
