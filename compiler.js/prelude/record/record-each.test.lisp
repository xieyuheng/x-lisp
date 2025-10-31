(import-all "record-each")

(begin
  (= record [:a 1 :b 2])
  (= list [])
  (record-each-value
   (lambda (value)
     (list-push! value list))
   record)
  (assert-equal [1 2] list))

(begin
  (= record [:a 1 :b 2])
  (= list [])
  (record-each-key
   (lambda (key)
     (list-push! key list))
   record)
  (assert-equal ['a 'b] list))

(begin
  (= record [:a 1 :b 2])
  (= list [])
  (record-each
   (lambda (key value)
     (list-push! key list)
     (list-push! value list))
   record)
  (assert-equal ['a 1 'b 2] list))
