#t
#f

true
false

(not #f)
(not #t)

(not false)
(not true)

(not (not #t))
(not (not #f))

(not (not true))
(not (not false))

(assert #t)
(assert true)

(assert (not #f))
(assert (not false))

(assert-equal (or) #f)
(assert-equal (and) #t)
