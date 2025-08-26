(tau int? int? :x int? :y int?)

(assert ((tau int? int? :x int? :y int?) [1 2 :x 1 :y 2]))
(assert-not ((tau int? int? :x int? :y int?) [1 2 :x 1 :y 'x]))
(assert-not ((tau int? int?) [1 'x]))

(assert-equal
  (the (tau int? int?) [1 2])
  [1 2])
