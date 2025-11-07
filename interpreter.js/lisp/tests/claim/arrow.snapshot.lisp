(-> int? int? int?)
(-> int? (-> int? int?))

(assert-equal
  (-> int? int? int?)
  (-> int? (-> int? int?)))

(assert-equal
  ((the (-> int? int? int?) iadd) 1 1)
  2)
