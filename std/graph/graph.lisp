(export
  graph?
  graph-edge?
  make-graph
  make-empty-graph
  graph-vertices
  graph-vertex-count
  graph-empty?
  graph-edges
  graph-edge-count
  graph-neighbors
  graph-add-vertex!
  graph-add-vertices!
  graph-add-edge!
  graph-add-edges!
  graph-adjacent?
  graph-degree)

(define-data (graph? V)
  (cons-graph
   (vertices (set? V))
   (neighbor-hash (hash? V (set? V)))))

(define graph-vertices cons-graph-vertices)
(define graph-neighbor-hash cons-graph-neighbor-hash)

(define (graph-edge? V)
  (union (tau V V)
         (negate (apply equal?))))

(claim make-graph
  (polymorphic (V)
    (-> (list? V) (list? (graph-edge? V))
        (graph? V))))

(define (make-graph vertices edges)
  (= graph (cons-graph (@set) (@hash)))
  (graph-add-vertices! vertices graph)
  (graph-add-edges! edges graph))

(claim make-empty-graph
  (polymorphic (V)
    (-> (graph? V))))

(define (make-empty-graph)
  (cons-graph (@set) (@hash)))

(claim graph-neighbors
  (polymorphic (V)
    (-> V (graph? V)
        (set? V))))

(define (graph-neighbors vertex graph)
  (hash-get vertex (graph-neighbor-hash graph)))

(claim graph-vertex-count
  (polymorphic (V)
    (-> (graph? V)
        int?)))

(define (graph-vertex-count graph)
  (set-size (graph-vertices graph)))

(claim graph-empty?
  (polymorphic (V)
    (-> (graph? V)
        bool?)))

(define (graph-empty? graph)
  (equal? 0 (graph-vertex-count graph)))

(claim graph-edges
  (polymorphic (V)
    (-> (graph? V)
        (set? (graph-edge? V)))))

(define (graph-edges graph)
  (pipe graph
    graph-neighbor-hash
    hash-entries
    (list-lift
     (lambda ([vertex neighbors])
       (pipe neighbors
         set-to-list
         (list-map
          (lambda (neighbor) {vertex neighbor})))))
    list-to-set
    (set-map set-to-list)))

(claim graph-edge-count
  (polymorphic (V)
    (-> (graph? V)
        int?)))

(define (graph-edge-count graph)
  (set-size (graph-edges graph)))

(claim graph-add-vertex!
  (polymorphic (V)
    (-> V (graph? V)
        (graph? V))))

(define (graph-add-vertex! vertex graph)
  (set-add! vertex (graph-vertices graph))
  graph)

(claim graph-add-vertices!
  (polymorphic (V)
    (-> (list? V) (graph? V)
        (graph? V))))

(define (graph-add-vertices! vertices graph)
  (list-each (swap graph-add-vertex! graph) vertices)
  graph)

(claim graph-add-edge!
  (polymorphic (V)
    (-> (graph-edge? V) (graph? V)
        (graph? V))))

(define (graph-add-edge! [source target] graph)
  (graph-add-vertex! source graph)
  (graph-add-vertex! target graph)
  (= neighbor-hash (graph-neighbor-hash graph))
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
    (-> (list? (graph-edge? V)) (graph? V)
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

(claim graph-degree
  (polymorphic (V)
    (-> V (graph? V)
        int?)))

(define (graph-degree vertex graph)
  (set-size (graph-neighbors vertex graph)))
