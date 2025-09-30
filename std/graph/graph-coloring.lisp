(import-all "graph")

(export graph-coloring/dsatur)

(claim graph-coloring/dsatur
  (polymorphic (V)
    (-> (graph? V)
        (hash? V int?))))

(define (graph-coloring/dsatur graph)
  (= queue (set-to-list (graph-vertices graph)))
  (= coloring (@hash))
  (graph-coloring/dsatur-loop graph queue coloring))

(claim graph-coloring/dsatur-loop
  (polymorphic (V)
    (-> (graph? V) (list? V) (hash? V int?)
        (hash? V int?))))

(define (graph-coloring/dsatur-loop graph queue coloring)
  (cond ((list-empty? queue) coloring)
        (else
         ;; TODO
         coloring)))
