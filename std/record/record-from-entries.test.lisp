(import-all "record-from-entries.lisp")

(assert-equal
  [:a 1 :b 2]
  (record-from-entries [['a 1] ['b 2]]))
