(assert (hash? int? int? (@hash)))
(assert (hash? int? int? (@hash 1 2 3 4)))

(assert-not (hash? int? int? (@hash 'a 2 'b 4)))
(assert-not (hash? int? int? (@hash 1 'a 3 'b)))

(assert-equal (@hash) (@hash))
(assert-equal (@hash 1 2 3 4) (@hash 1 2 3 4))
(assert-equal (@hash 1 2 3 4) (@hash 3 4 1 2))
(assert-not-equal (@hash 1 2 3 4) (@hash 3 4 1 5))

(assert (hash-empty? (@hash)))
(assert-not (hash-empty? (@hash 1 2)))
(assert-not (hash-empty? (@hash 1 2 3 4)))

(assert-equal 0 (hash-length (@hash)))
(assert-equal 1 (hash-length (@hash 1 2)))
(assert-equal 2 (hash-length (@hash 1 2 3 4)))

(assert-equal null (hash-get 1 (@hash)))
(assert-equal 2 (hash-get 1 (@hash 1 2)))
(assert-equal 2 (hash-get 1 (@hash 1 2 3 4)))
(assert-equal 4 (hash-get 3 (@hash 1 2 3 4)))

(begin
  (= hash (@hash))
  (assert-equal (@hash 1 2) (hash-put 1 2 hash))
  (assert-equal (@hash 1 2 3 4) (hash-put 3 4 (hash-put 1 2 hash)))
  (assert-equal (@hash) hash))

(begin
  (= hash (@hash))
  (assert-equal (@hash 1 2) (hash-put! 1 2 hash))
  (assert-equal (@hash 1 2 3 4) (hash-put! 3 4 hash))
  (assert-equal (@hash 1 2 3 4) hash))

(begin
  (= hash (@hash 1 2 3 4))
  (assert-equal (@hash 1 2) (hash-delete! 3 hash))
  (assert-equal (@hash) (hash-delete! 1 hash))
  (assert-equal (@hash) hash))

(begin
  (= hash (@hash 1 2))
  (assert-equal (@hash 1 2) (hash-copy hash))
  (assert-equal (@hash 1 2 3 4) (hash-put! 3 4 (hash-copy hash)))
  (assert-equal (@hash 1 2) hash))

(begin
  (= hash (@hash 1 2 3 4))
  (assert-equal [[1 2] [3 4]] (hash-entries hash))
  (assert-equal [1 3] (hash-keys hash))
  (assert-equal [2 4] (hash-values hash)))

;; hash as key

(begin
  (= hash (@hash))
  (hash-put! (@hash 1 2) 1 hash)
  (hash-put! (@hash 3 4) 3 hash)
  (assert-equal (@hash (@hash 1 2) 1 (@hash 3 4) 3) hash)
  (assert-equal 1 (hash-get (@hash 1 2) hash))
  (assert-equal 3 (hash-get (@hash 3 4) hash)))

;; set as key

(begin
  (= hash (@hash))
  (hash-put! (@set 1 2) 1 hash)
  (hash-put! (@set 3 4) 3 hash)
  (assert-equal (@hash (@set 1 2) 1 (@set 3 4) 3) hash)
  (assert-equal 1 (hash-get (@set 1 2) hash))
  (assert-equal 3 (hash-get (@set 3 4) hash)))
