(define point-t
  (@interface
    :x float-t
    :y float-t))

(claim main (-> void-t))

(define (main)
  (the point-t (@record :x 1.0 :y 2.0))
  (the point-t (@record :x 1.0)))
