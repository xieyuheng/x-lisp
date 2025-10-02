(import-all "set-select")

(assert-equal {0 1 2} (set-select int-non-negative? {-2 -1 0 1 2}))
(assert-equal {0 1 2} ((specific set-select int?)
                       int-non-negative? {-2 -1 0 1 2}))

(assert-equal {-1 -2} (set-reject int-non-negative? {-2 -1 0 1 2}))
(assert-equal {-1 -2} ((specific set-reject int?)
                       int-non-negative? {-2 -1 0 1 2}))
