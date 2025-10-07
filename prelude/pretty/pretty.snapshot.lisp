(import-all "pretty")

;; list

(begin
  (= value [[1 2 3]
            [4 5 6]
            [7 8 9]])
  (pretty-print 30 value)
  (pretty-print 10 value)
  (pretty-print 5 value))

;; set

(begin
  (= value {{1 2 3}
            {4 5 6}
            {7 8 9}})
  (pretty-print 30 value)
  (pretty-print 10 value)
  (pretty-print 5 value))

;; record

(begin
  (= value [:x [:x 1 :y 2 :z 3]
            :y [:x 4 :y 5 :z 6]
            :z [:x 7 :y 8 :z 9]])
  (pretty-print 30 value)
  (pretty-print 10 value)
  (pretty-print 5 value))

;; list with attributes

(begin
  (= value [1 2 3
            :x 1 :y 2 :z 3])
  (pretty-print 30 value)
  (pretty-print 10 value)
  (pretty-print 5 value)
  (pretty-print 3 value))

;; hash

(begin
  (= value (@hash
            "x" (@hash "x" 1 "y" 2 "z" 3)
            "y" (@hash "x" 4 "y" 5 "z" 6)
            "z" (@hash "x" 7 "y" 8 "z" 9)))
  (pretty-print 60 value)
  (pretty-print 30 value)
  (pretty-print 10 value)
  (pretty-print 5 value))
