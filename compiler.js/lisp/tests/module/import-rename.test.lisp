(import "module-one" (rename one ione))
(import "module-two" (rename two itwo))

(assert-equal ione 1)
(assert-equal itwo 2)
