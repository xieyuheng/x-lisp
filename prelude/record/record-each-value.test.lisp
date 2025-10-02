(import-all "record-each-value")

(begin
  (= record [:a 1 :b 2])
  (= list [])
  (record-each-value
   (lambda (value)
     (list-push! value list))
   record)
  (assert-equal [1 2] list))
