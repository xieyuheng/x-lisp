(import-all "list-index")

(assert-equal 2 (list-index 3 ['a 'b 3 'd]))
(assert-equal null (list-index 3 ['a 'b 'c 'd]))
