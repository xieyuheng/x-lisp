(import-all "list-some")

(assert (list-some? int-non-negative? [-1 -2 0]))
(assert-not (list-some? int-non-negative? [-1 -2 -3]))
