(import-all "record-put-many.lisp")

(assert-equal
  [:a 1 :b 2]
  (record-put-many [['a 1] ['b 2]] []))
