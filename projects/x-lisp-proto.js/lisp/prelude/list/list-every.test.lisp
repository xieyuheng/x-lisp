(import-all "list-every")

(assert (list-every? int-non-negative? [0 1 2 3]))
(assert-not (list-every? int-non-negative? [0 1 -1 2 3]))
