;; tael

(assert-equal
  ((@pattern [a b c :x x :y y]) [1 2 3 :x 1 :y 2])
  [:a 1 :b 2 :c 3 :x 1 :y 2])

(assert-equal
  ((@pattern [:x x :y y :z z]) [:x 1 :y 2])
  [:x 1 :y 2 :z null])

;; literal

(assert-equal
  ((@pattern 1) 1)
  [])

(assert-equal
  ((@pattern 1) 2)
  null)

(assert-equal
  ((@pattern "a") "a")
  [])

(assert-equal
  ((@pattern #abc) #abc)
  [])

(assert-equal
  ((@pattern '(a b c)) '(a b c))
  [])

;; cons and cons*

(assert-equal
  ((@pattern (cons head tail)) '(a b c))
  [:head 'a :tail '(b c)])

(assert-equal
  ((@pattern (cons* first second tail)) '(a b c))
  [:first 'a :second 'b :tail '(c)])

;; escape

(assert-equal
  ((@pattern (cons* first (@escape (iadd 1 1)) tail)) '(1 2 3))
  [:first 1 :tail '(3)])

(assert-equal
  ((@pattern (cons* first (@escape (iadd 1 2)) tail)) '(1 2 3))
  null)

;; no need to escape: true false null void

(assert-equal ((@pattern null) null) [])
(assert-equal ((@pattern void) void) [])
(assert-equal ((@pattern true) true) [])
(assert-equal ((@pattern false) false) [])

;; quasiquote

(assert-equal
  ((@pattern `(,first ,(@escape (iadd 1 1)) 3)) '(1 2 3))
  [:first 1])

(assert-equal
  ((@pattern `(,first ,(@escape (iadd 1 2)) 3)) '(1 2 3))
  null)

;; occur many times

(assert-equal
  ((@pattern [x x]) [1 1])
  [:x 1])

(assert-equal
  ((@pattern [x x]) [1 2])
  null)
