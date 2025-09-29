;; undirected simple graph

(export
  graph? make-graph
  graph-vertices
  graph-neighbors
  graph-add-vertex!
  graph-add-edge!
  graph-add-edges!
  graph-adjacent?)

(define-data (graph? V)
  (cons-graph
   (vertices (set? V))
   (neighbor-hash (hash? V (set? V)))))

(claim make-graph
  (polymorphic (V)
    (-> (list? (tau V V))
        (graph? V))))

(define (make-graph edges)
  (= vertices (@set))
  (= neighbor-hash (@hash))
  (= graph (cons-graph vertices neighbor-hash))
  (graph-add-edges! edges graph))

(claim graph-vertices
  (polymorphic (V)
    (-> (graph? V)
        (set? V))))

(define (graph-vertices graph)
  (cons-graph-vertices graph))

(claim graph-neighbors
  (polymorphic (V)
    (-> V (graph? V)
        (set? V))))

(define (graph-neighbors vertex graph)
  (hash-get vertex (cons-graph-neighbor-hash graph)))

(claim graph-add-vertex!
  (polymorphic (V)
    (-> V (graph? V)
        (graph? V))))

(define (graph-add-vertex! vertex graph)
  (set-add! vertex (cons-graph-vertices graph))
  graph)

(claim graph-add-edge!
  (polymorphic (V)
    (-> (tau V V) (graph? V)
        (graph? V))))

(define (graph-add-edge! edge graph)
  (= [source target] edge)
  (graph-add-vertex! source graph)
  (graph-add-vertex! target graph)
  (= neighbor-hash (cons-graph-neighbor-hash graph))
  (= source-neighbors (hash-get source neighbor-hash))
  (if (null? source-neighbors)
    (hash-put! source {target} neighbor-hash)
    (set-add! target source-neighbors))
  (= target-neighbors (hash-get target neighbor-hash))
  (if (null? target-neighbors)
    (hash-put! target {source} neighbor-hash)
    (set-add! source target-neighbors))
  graph)

(claim graph-add-edges!
  (polymorphic (V)
    (-> (list? (tau V V)) (graph? V)
        (graph? V))))

(define (graph-add-edges! edges graph)
  (list-each (swap graph-add-edge! graph) edges)
  graph)

(claim graph-adjacent?
  (polymorphic (V)
    (-> V V (graph? V)
        bool?)))

(define (graph-adjacent? source target graph)
  (set-member? target (graph-neighbors source graph)))
