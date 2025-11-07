void
#void
[#void #void #void]

(assert (void? void))
(assert (void? #void))
(assert-not (void? #t))
(assert-not (void? #f))
