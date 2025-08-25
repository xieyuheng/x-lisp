(lazy 1)

(iadd (lazy 1))
((lazy iadd) (lazy 1))

(assert-equal (iadd (lazy 1) (lazy 2)) 3)
(assert-equal ((lazy iadd) (lazy 1) (lazy 2)) 3)

(begin
  (= x (lazy 1))
  (= y (lazy 2))
  (assert-equal (iadd x y) 3))

(begin
  (= x (lazy (lazy 1)))
  (= y (lazy (lazy 2)))
  (assert-equal (iadd x y) 3))

(begin
  (= x (lazy (begin (println "lazy 1") 1)))
  (= y (lazy (begin (println "lazy 2") 2)))
  (iadd x))

(begin
  (= x (lazy (begin (println "lazy 1") 1)))
  (= y (lazy (begin (println "lazy 2") 2)))
  (assert-equal (iadd x y) 3))
