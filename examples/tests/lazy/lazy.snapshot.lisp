(lazy 1)

(iadd (lazy 1))
((lazy iadd) (lazy 1))

(iadd (lazy (begin (println "lazy 1") 1)))

(assert-equal
  (iadd (lazy (begin (println "lazy 1") 1))
        (lazy (begin (println "lazy 2") 2)))
  3)
