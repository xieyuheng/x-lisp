(import-all "my-list")

(begin
  (= (li f (li g (li h nil)))
     (the (my-list? (-> int? int?))
       (li (iadd 1)
           (li (iadd 2)
               (li (iadd 3)
                   nil)))))
  (assert-equal 1 (f 0))
  (assert-equal 2 (g 0))
  (assert-equal 3 (h 0)))
