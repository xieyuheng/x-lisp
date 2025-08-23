(import-all "list-drop.lisp")

(assert-equal (list-drop [1 2 3] 0) [1 2 3])
(assert-equal (list-drop [1 2 3] 1) [2 3])
(assert-equal (list-drop [1 2 3] 2) [3])
(assert-equal (list-drop [1 2 3] 3) [])
(assert-equal (list-drop [1 2 3] 4) [])
