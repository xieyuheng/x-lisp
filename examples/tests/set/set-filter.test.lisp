(assert-equal
  {0 1 2}
  (set-filter int-non-negative? {-2 -1 0 1 2}))
