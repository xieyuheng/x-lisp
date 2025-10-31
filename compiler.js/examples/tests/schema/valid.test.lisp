(assert (valid? int? 1))
(assert-not (valid? float? 1))

;; literal atom as schema

(assert (valid? 1 1))
(assert-not (valid? 1 2))
(assert (valid? 'a 'a))
(assert-not (valid? 'a 'b))
