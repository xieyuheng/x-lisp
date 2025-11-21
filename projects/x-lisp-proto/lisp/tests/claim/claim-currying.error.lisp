(claim my-add (-> int? int? int?))
(define my-add
  (lambda (x)
    (lambda (y)
      (iadd x y))))

(my-add 1.0 1.0)
