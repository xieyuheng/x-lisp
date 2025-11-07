(assert ((tau int? int? :x int? :y int?) [1 2 :x 1 :y 2]))
(assert-not ((tau int? int? :x int? :y int?) [1 2 :x 1 :y 'x]))
(assert-not ((tau int? int?) [1 'x]))

(assert-equal [1 2] (the (tau int? int?) [1 2]))

;; literal atom as schema

(assert ((tau 'abc int?) ['abc 1]))
(assert ((tau #abc int?) [#abc 1]))
(assert-not ((tau #abc int?) [#abcdef 1]))

(assert-equal ['abc 1] (the (tau 'abc int?) ['abc 1]))
(assert-equal [#abc 1] (the (tau #abc int?) [#abc 1]))
