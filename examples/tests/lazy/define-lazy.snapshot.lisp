(define-lazy (my-if p t f) (if p t f))

(my-if #t 1 2)
(my-if #f 1 2)

(assert-equal (my-if #t 1 2) 1)
(assert-equal (my-if #f 1 2) 2)

(my-if
 #t
 (begin (println "my-if true") 1)
 (begin (println "my-if false") 2))
