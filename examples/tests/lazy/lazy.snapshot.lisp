(lazy 1)

(iadd (lazy 1))
((lazy iadd) (lazy 1))

(iadd (lazy (begin (println "lazy 1") 1)))

(begin
  (= x (lazy (begin (println "lazy 1") 1)))
  (= y (lazy (begin (println "lazy 2") 2)))
  (assert-equal (iadd x y) 3))
