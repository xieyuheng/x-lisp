(import-all "pretty")

(assert-equal "[]" (pretty-format 0 []))
(assert-equal "{}" (pretty-format 0 {}))
(assert-equal "(@hash)" (pretty-format 0 (@hash)))
