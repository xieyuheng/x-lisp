(import-all "../function")
(import-all "../string")
(import-all "../list")
(import-all "pretty")

(define (test-widths widths value)
  (pipe widths
    (list-each
     (lambda (width)
       (write (string-repeat width "-"))
       (write "|")
       (write (format width))
       (write "\n")
       (pretty-print width value)))))

;; list

(test-widths
 [30 10 5]
 [[1 2 3]
  [4 5 6]
  [7 8 9]])

;; set

(test-widths
 [30 10 5]
 {{1 2 3}
  {4 5 6}
  {7 8 9}})

;; record

(test-widths
 [30 10 5]
 [:x [:x 1 :y 2 :z 3]
  :y [:x 4 :y 5 :z 6]
  :z [:x 7 :y 8 :z 9]])

;; list with attributes

(test-widths
 [30 10 5 3]
 [1 2 3 :x 1 :y 2 :z 3])

;; hash

(test-widths
 [60 30 10 5]
 (@hash
  "x" (@hash "x" 1 "y" 2 "z" 3)
  "y" (@hash "x" 4 "y" 5 "z" 6)
  "z" (@hash "x" 7 "y" 8 "z" 9)))
