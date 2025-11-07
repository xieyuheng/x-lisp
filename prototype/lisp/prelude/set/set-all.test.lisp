(import-all "set-all")

(assert (set-all? int-non-negative? {0 1 2 3}))
(assert-not (set-all? int-non-negative? {0 1 -1 2 3}))
