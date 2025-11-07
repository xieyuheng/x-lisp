(import-all "list-find-index")

(assert-equal 2 (list-find-index int? ['a 'b 3 'd]))
(assert-equal null (list-find-index int? ['a 'b 'c 'd]))
