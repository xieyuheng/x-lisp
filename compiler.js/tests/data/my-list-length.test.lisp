(import-all "my-list")
(import-all "my-list-length")

(assert-equal (length nil) 0)
(assert-equal (length (li 1 (li 2 (li 3 nil)))) 3)
