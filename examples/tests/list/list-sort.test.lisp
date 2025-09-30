;; int ascending

(begin
  (= list [2 3 1])
  (assert-equal [1 2 3] (list-sort! int-compare/ascending list))
  (assert-equal [1 2 3] list))

(begin
  (= list [2 3 1])
  (assert-equal [1 2 3] (list-sort int-compare/ascending list))
  (assert-equal [2 3 1] list))

;; int descending

(assert-equal [3 2 1] (list-sort int-compare/descending [2 3 1]))

;; float ascending

(assert-equal [1.0 2.0 3.0] (list-sort float-compare/ascending [2.0 3.0 1.0]))

;; float descending

(assert-equal [3.0 2.0 1.0] (list-sort float-compare/descending [2.0 3.0 1.0]))

;; string lexical

(assert-equal
  ["a" "b" "c"]
  (list-sort string-compare/lexical ["b" "c" "a"]))
