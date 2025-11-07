(assert (atom? 1))
(assert (atom? 'a))
(assert (atom? "abc"))

(assert (not (atom? '(1))))
(assert (not (atom? '(a b c))))
