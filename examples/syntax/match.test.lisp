;; tael

(begin
  (= value [1 2 3 :x 1 :y 2])
  (match value
    ([a b c :x x :y y]
     (assert (equal? a 1))
     (assert (equal? b 2))
     (assert (equal? c 3))
     (assert (equal? x 1))
     (assert (equal? y 2)))))

(begin
  (= value [1 2 3 :x 1 :y 2])
  (match value
    ([a b c :x x :y y :z z] (assert false))
    (_ (assert true))))

(begin
  ;; `null` as not exists
  (= value [1 2 3 :x 1 :y 2 :z null])
  (match value
    ([a b c :x x :y y :z z] (assert false))
    (_ (assert true))))

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
   (assert (equal? head 'a))
   (assert (equal? tail '(b c)))))

(match '(a b c)
  ((cons* first second tail)
   (assert (equal? first 'a))
   (assert (equal? second 'b))
   (assert (equal? tail '(c)))))

;; eval

(match '(1 2 3)
  ((cons* first (eval (iadd 1 1)) tail)
   (assert (equal? first 1))
   (assert (equal? tail '(3)))))

(match '(1 2 3)
  ((cons* first (eval (iadd 1 2)) tail)
   (assert false))
  (_ (assert true)))
