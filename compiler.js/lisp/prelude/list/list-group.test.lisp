(import-all "../function")
(import-all "list-group")

(assert-equal
  (@hash 0 [0 3]
         1 [1 4]
         2 [2 5])
  (list-group (swap imod 3) [0 1 2 3 4 5]))
