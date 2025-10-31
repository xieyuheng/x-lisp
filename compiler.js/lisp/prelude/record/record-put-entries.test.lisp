(import-all "record-put-entries")

(assert-equal [:a 1 :b 2] (record-put-entries [['a 1] ['b 2]] []))

(begin
  (= record [])
  (assert-equal [:a 1 :b 2] (record-put-entries! [['a 1] ['b 2]] record))
  (assert-equal [:a 1 :b 2] record))
