(import-all "set-select.lisp")

(assert-equal
  {0 1 2}
  (set-select int-non-negative? {-2 -1 0 1 2}))
