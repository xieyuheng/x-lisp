(import-all "list-find.lisp")

(assert-equal 3 (list-find int? ['a 'b 3 'd]))
(assert-equal null (list-find int? ['a 'b 'c 'd]))
