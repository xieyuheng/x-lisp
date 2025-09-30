(import-all "graph")

(export graph-coloring/dsatur)

(define color? int?)
(define (coloring? V) (hash? V color?))

(claim graph-coloring/dsatur
  (polymorphic (V)
    (-> (graph? V)
        (coloring? V))))

(define (graph-coloring/dsatur graph)
  (= coloring (@hash))
  (= queue (set-to-list (graph-vertices graph)))
  (graph-coloring/dsatur-loop graph coloring queue))

(claim graph-coloring/dsatur-loop
  (polymorphic (V)
    (-> (graph? V) (coloring? V) (list? V)
        (coloring? V))))

(define (graph-coloring/dsatur-loop graph coloring queue)
  (sort-by-saturation! graph coloring queue)
  (cond ((list-empty? queue) coloring)
        (else
         ;; TODO
         coloring)))

(claim saturation
  (polymorphic (V)
    (-> (graph? V) (coloring? V) V
        (set? color?))))

(define (saturation graph coloring vertex)
  ;; TODO
  {})

(define (sort-by-saturation! graph coloring queue)
  ;; TODO
  void)
