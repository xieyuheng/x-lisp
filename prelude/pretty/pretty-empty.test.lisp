(import-all "pretty")

(assert-equal "[]" (pretty 0 []))
(assert-equal "{}" (pretty 0 {}))
(assert-equal "(@hash)" (pretty 0 (@hash)))
