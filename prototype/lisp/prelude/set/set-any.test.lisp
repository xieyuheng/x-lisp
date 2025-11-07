(import-all "set-any")

(assert (set-any? int-non-negative? {-1 -2 0}))
(assert-not (set-any? int-non-negative? {-1 -2 -3}))
