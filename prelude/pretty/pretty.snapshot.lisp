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
