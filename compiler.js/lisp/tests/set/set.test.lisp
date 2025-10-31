(assert-equal {1 2 3} {1 2 3 1 2 3})
(assert-equal {1 2 {1 2 3}} {1 2 {1 2 3 1 2 3}})
(assert-not-equal {1 2 {1 2 3}} {1 2 {1 2}})

(assert (set? int? {1 2 3}))
(assert-not (set? int? {1 2 {1 2 3}}))

(assert (set-empty? {}))
(assert-not (set-empty? {1}))

(assert-equal 3 (set-size {1 2 3}))

(assert (set-member? 2 {1 2 3}))
(assert-not (set-member? 4 {1 2 3}))

(assert (set-include? {1 2} {1 2 3}))
(assert (set-include? {1 2 3} {1 2 3}))
(assert-not (set-include? {1 4} {1 2 3}))

(assert-equal [1 2 3] (set-to-list {1 2 3}))

(begin
  (= set {1 2 3})
  (assert-equal {1 2 3 4} (set-add 4 set))
  (assert-equal {1 2 3} set))

(begin
  (= set {1 2 3})
  (assert-equal {1 2 3 4} (set-add! 4 set))
  (assert-equal {1 2 3 4} set))

(begin
  (= set {1 2 3})
  (assert-equal {1 3} (set-delete 2 set))
  (assert-equal {1 2 3} set))

(begin
  (= set {1 2 3})
  (assert-equal {1 3} (set-delete! 2 set))
  (assert-equal {1 3} set))

(begin
  (= set {1 2 3})
  (assert-equal {} (set-clear! set))
  (assert-equal {} set))

(assert-equal {1 2 3 4 5} (set-union {1 2 3} {3 4 5}))
(assert-equal {3} (set-inter {1 2 3} {3 4 5}))
(assert-equal {1 2} (set-difference {1 2 3} {3 4 5}))

(assert-not (set-disjoint? {1 2 3} {3 4 5}))
(assert (set-disjoint? {1 2 3} {4 5}))

;; nested set

(assert-equal
  (@set (@set 1 2 3) (@set 1 2 3) (@set 1 2 3))
  (@set (@set 1 2 3)))
