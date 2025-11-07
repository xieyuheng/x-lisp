(import-all "list-all")

(assert (list-all? int-non-negative? [0 1 2 3]))
(assert-not (list-all? int-non-negative? [0 1 -1 2 3]))
