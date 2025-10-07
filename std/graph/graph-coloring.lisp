(import-all "graph")

;; graph coloring by DSATUR algorithm

(export graph-coloring!)

(define color? int?)
(define (coloring? V) (hash? V color?))

(claim graph-coloring!
  (polymorphic (V)
    (-> (coloring? V) (list? V) (graph? V)
        (coloring? V))))

(define (graph-coloring! coloring queue graph)
  (queue-sort-by-saturation! graph coloring queue)
  (match queue
    ([] coloring)
    ((cons first rest-queue)
     (unless (hash-has? first coloring)
       (= saturation (vertex-saturation graph coloring first))
       (= color (next-not-used-color saturation))
       (hash-put! first color coloring))
     (graph-coloring! coloring rest-queue graph))))

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
     (= order (int-compare-descending
               (set-size (vertex-saturation graph coloring v1))
               (set-size (vertex-saturation graph coloring v2))))
     (if (sort-order-same? order)
       (int-compare-descending
        (graph-vertex-degree v1 graph)
        (graph-vertex-degree v2 graph))
       order))
   queue))

;; (define (queue-sort-by-saturation! graph coloring queue)
;;   (list-sort!
;;    (compose-compare
;;     (lambda (v1 v2)
;;       (int-compare-descending
;;        (set-size (vertex-saturation graph coloring v1))
;;        (set-size (vertex-saturation graph coloring v2))))
;;     (lambda (v1 v2)
;;       (int-compare-descending
;;        (graph-vertex-degree v1 graph)
;;        (graph-vertex-degree v2 graph))))
;;    queue))
