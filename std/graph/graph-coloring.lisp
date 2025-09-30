(import-all "graph")

(claim graph-coloring/dsatur
  (polymorphic (V)
    (-> (graph? V)
        (hash? V int?))))

(define (graph-coloring/dsatur graph)
  (graph-coloring/dsatur-loop
   graph (graph-vertices graph) (@hash)))

(claim graph-coloring/dsatur-loop
  (polymorphic (V)
    (-> (graph? V) (list? V) (hash? V int?)
        (hash? V int?))))

(define (graph-coloring/dsatur-loop graph queue coloring)
  (cond ((list-empty? queue) coloring)
        ;; TODO
        ;; (else )
        ))
