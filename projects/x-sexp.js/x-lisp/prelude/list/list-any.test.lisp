(import-all "list-any")

(assert (list-any? int-non-negative? [-1 -2 0]))
(assert-not (list-any? int-non-negative? [-1 -2 -3]))
