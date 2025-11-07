(import-all "list-drop")

(assert-equal (list-drop 0 [1 2 3]) [1 2 3])
(assert-equal (list-drop 1 [1 2 3]) [2 3])
(assert-equal (list-drop 2 [1 2 3]) [3])
(assert-equal (list-drop 3 [1 2 3]) [])
(assert-equal (list-drop 4 [1 2 3]) [])
