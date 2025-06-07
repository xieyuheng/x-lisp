(define-type point-t (tau number-t number-t))

(claim point-x (-> point-t number-t))
(define (point-x p) (list-get p 0))

(claim point-y (-> point-t number-t))
(define (point-y p) (list-get p 1))

(claim distance (-> point-t point-t number-t))
(define (distance p1 p2)
  (square-root
   (add (square (sub (point-x p2) (point-x p1)))
        (square (sub (point-y p2) (point-y p1))))))

(distance [0 0] [3.1415 2.7172])
