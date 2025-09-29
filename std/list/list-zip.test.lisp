(import-all "list-zip")

(assert-equal
  (list-zip ['a 'b 'c] [1 2 3])
  [['a 1] ['b 2] ['c 3]])

(assert-equal
  (list-zip ['a 'b 'c] [1 2])
  [['a 1] ['b 2]])
