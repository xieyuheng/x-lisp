(import-all "record-from-entries")

(assert-equal
  [:a 1 :b 2]
  (record-from-entries [['a 1] ['b 2]]))
