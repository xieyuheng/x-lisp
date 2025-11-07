(import-all "hash-find-key")

(begin
  (= hash (@hash 1 2 3 4))
  (assert-equal 1 (hash-find-key (equal? 2) hash))
  (assert-equal 3 (hash-find-key (equal? 4) hash))
  (assert-equal null (hash-find-key (equal? 6) hash)))

;; find the first key

(begin
  (= hash (@hash 1 2 3 2))
  (assert-equal 1 (hash-find-key (equal? 2) hash)))
