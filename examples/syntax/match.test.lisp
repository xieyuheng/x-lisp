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

;; atom

(match 1
  (1 (assert true))
  (_ (assert false)))

(match "a"
  ("a" (assert true))
  (_ (assert false)))
