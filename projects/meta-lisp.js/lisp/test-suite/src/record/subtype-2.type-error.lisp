(define point-t
  (@interface
    :x float-t
    :y float-t))

(claim point-println (-> point-t void-t))

(define (point-println point)
  (println point))

(claim main (-> void-t))

(define (main)
  (point-println (@record :x 1.0 :y 2.0))
  (point-println (@record :x 1.0)))
