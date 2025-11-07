(begin
  (= [f g h]
     (the (list? (-> int? int?))
       [(iadd 1) (iadd 2) (iadd 3)]))
  (assert-equal 1 (f 0))
  (assert-equal 2 (g 0))
  (assert-equal 3 (h 0)))
