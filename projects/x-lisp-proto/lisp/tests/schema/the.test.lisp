(assert-equal 1 (the int? 1))

;; literal atom as schema

(assert-equal 1 (the 1 1))
(assert-equal 'a (the 'a 'a))
