(import-all "list-unzip")

(assert-equal
  (list-unzip [['a 1] ['b 2] ['c 3]])
  [['a 'b 'c] [1 2 3]])
