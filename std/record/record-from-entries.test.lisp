(import-all "record-from-entries.lisp")

(assert-equal
  (record-from-entries [['a 1] ['b 2]])
  [:a 1 :b 2])
