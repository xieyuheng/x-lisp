(-> int? int? int?)
(-> int? (-> int? int?))

(assert-equal
  (-> int? int? int?)
  (-> int? (-> int? int?)))

((-> int? int? int?) iadd)

(assert-equal
  (((-> int? int? int?) iadd) 1 1)
  2)
