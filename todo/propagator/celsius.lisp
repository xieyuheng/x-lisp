;; c = (f - 32) * 5/9

(define-propagator (fahrenheit-to-celsius f c)
  (multiplier
   (subtractor f 32)
   (divider 5 9)
   c))

;; maybe use -pp postfix to name all propagators,
;; unified namespace is a problem here.

(define-propagator (fahrenheit-to-celsius-pp f c)
  (mul-pp
   (sub-pp f 32)
   (div-pp 5 9)
   c))

(define-propagator (fahrenheit-celsius f c)
  (= a (cell))
  (sum a 32 f)
  (= b (cell))
  (product b 9 5)
  (product a b c))

(define-propagator (celsius-kelvin c k)
  (sum c 273.15 k))
