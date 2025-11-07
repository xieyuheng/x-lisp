(import-all "record-update")

(assert-equal
  [:a 2 :b 2]
  (record-update
   'a (lambda (a) (if (null? a) 0 (iadd 1 a)))
   [:a 1 :b 2]))

(assert-equal
  [:a 0 :b 2]
  (record-update
   'a (lambda (a) (if (null? a) 0 (iadd 1 a)))
   [:b 2]))

(begin
  (= record [:a 1 :b 2])
  (record-update! 'a (lambda (a) (if (null? a) 0 (iadd 1 a))) record)
  (assert-equal [:a 2 :b 2] record))

(begin
  (= record [:b 2])
  (record-update! 'a (lambda (a) (if (null? a) 0 (iadd 1 a))) record)
  (assert-equal [:a 0 :b 2] record))
