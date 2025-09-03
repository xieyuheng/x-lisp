(import-all "my-list.lisp")
(import-all "my-list-length.lisp")

(assert-equal (length nil) 0)
(assert-equal (length (li 1 (li 2 (li 3 nil)))) 3)
