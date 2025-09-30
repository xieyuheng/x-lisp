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
  (queue-sort-by-saturation! graph coloring queue)
  (cond ((list-empty? queue) coloring)
        (else
         (= (cons first rest-queue) queue)
         (= saturation (vertex-saturation graph coloring first))
         (= color (next-not-used-color saturation))
         (graph-coloring/dsatur-loop
          graph
          (hash-put! first color coloring)
          rest-queue))))

(claim next-not-used-color
  (-> (set? color?)
      color?))

(define (next-not-used-color color-set)
  (next-not-used-color/loop color-set 0))

(define (next-not-used-color/loop color-set color)
  (if (set-member? color color-set)
    (next-not-used-color/loop color-set (iadd 1 color))
    color))

(claim vertex-saturation
  (polymorphic (V)
    (-> (graph? V) (coloring? V) V
        (set? color?))))

(define (vertex-saturation graph coloring vertex)
  (= neighbors (graph-neighbors vertex graph))
  (pipe neighbors
    (set-map (swap hash-get coloring))
    (set-reject null?)))

(define (queue-sort-by-saturation! graph coloring queue)
  (list-sort!
   (lambda (v1 v2)
     (int-compare/descending
      (set-size (saturation graph coloring v1))
      (set-size (saturation graph coloring v2)))
   queue)))
