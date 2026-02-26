(claim Y
  (polymorphic (A)
    (-> (-> A A) A)))

(define (Y f)
  ((lambda (u) (u u))
   (lambda (x) (f (lambda (t) ((x x) t))))))

;; (define (Y f)
;;   ((the (polymorphic (B) (-> (mu (X) (-> X B)) B))
;;      (lambda (u) (u u)))
;;    (the (polymorphic (A) (-> (mu (Y) (-> Y A)) A))
;;      (lambda (x) (f (lambda (t) ((x x) t)))))))
