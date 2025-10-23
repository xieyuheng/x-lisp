;; c = (f - 32) * 5/9

(define-propagator (fahrenheit-to-celsius f c)
  (multiplier
   (subtractor f (constant-cell 32))
   (divider (constant-cell 5) (constant-cell 9))
   c))

(define-propagator (fahrenheit-celsius f c)
  (= a (cell))
  (sum a (constant-cell 32) f)
  (= b (cell))
  (product b (constant-cell 9) (constant-cell 5))
  (product a b c))

(define-propagator (celsius-kelvin c k)
  (sum c (constant-cell 273.15) k))
