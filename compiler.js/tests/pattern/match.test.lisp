;; tael

(begin
  (= value [1 2 3 :x 1 :y 2])
  (match value
    ([a b c :x x :y y]
     (assert-equal a 1)
     (assert-equal b 2)
     (assert-equal c 3)
     (assert-equal x 1)
     (assert-equal y 2))))

(begin
  (= value [1 2 3 :x 1 :y 2])
  (match value
    ([a b c :x x :y y :z z] (assert (null? z)))
    (_ (assert false))))

;; literal

(match 1
  (1 (assert true))
  (_ (assert false)))

(match "a"
  ("a" (assert true))
  (_ (assert false)))

(match #void
  (#void (assert true))
  (_ (assert false)))

(match #null
  (#null (assert true))
  (_ (assert false)))

(match 'a
  ('a (assert true))
  (_ (assert false)))

(match '(a b c)
  ('(a b c) (assert true))
  (_ (assert false)))

;; cons and cons*

(match '(a b c)
  ((cons head tail)
   (assert-equal head 'a)
   (assert-equal tail '(b c))))

(match '(a b c)
  ((cons* first second tail)
   (assert-equal first 'a)
   (assert-equal second 'b)
   (assert-equal tail '(c))))

;; escape

(match '(1 2 3)
  ((cons* first (@escape (iadd 1 1)) tail)
   (assert-equal first 1)
   (assert-equal tail '(3))))

(match '(1 2 3)
  ((cons* first (@escape (iadd 1 2)) tail) (assert false))
  (_ (assert true)))

(match null
  ((@escape null) (assert true))
  (_ (assert false)))

;; quasiquote

(match '(1 2 3)
  (`(,first ,(@escape (iadd 1 1)) 3)
   (assert (equal? first 1))))

(match '(1 2 3)
  (`(,first ,(@escape (iadd 1 2)) 3) (assert false))
  (_ (assert true)))

;; occur many times

(match [1 2]
  ([x x] (assert false))
  (_ (assert true)))

(match [1 1]
  ([x x] (assert true))
  (_ (assert false)))

;; the

(match [1 2]
  ([x (the int? y)]
   (assert-equal x 1)
   (assert-equal y 2))
  (_ (assert false)))

(match [1 2]
  ([x (the float? y)]
   (assert false))
  (_ (assert true)))
