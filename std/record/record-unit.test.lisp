(import-all "record-unit.lisp")

(assert-equal
  [:a 1]
  (record-unit 'a 1))
