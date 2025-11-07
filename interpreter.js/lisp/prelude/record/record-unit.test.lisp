(import-all "record-unit")

(assert-equal
  [:a 1]
  (record-unit 'a 1))
