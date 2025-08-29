(begin
  (= record [:a 0 :b 0])
  (= record (record-set 'a 1 record))
  (= record (record-set 'b 2 record))
  (assert-equal record [:a 1 :b 2]))

;; about insertion order:

(begin
  (= record [])
  (= record (record-set 'a 1 record))
  (= record (record-set 'b 2 record))
  (assert-equal (record-entries record) [['a 1] ['b 2]]))

;; record-set has NO side effect:

(begin
  (= record [:a 0 :b 0])
  (record-set 'a 1 record)
  (record-set 'b 2 record)
  (assert-equal record [:a 0 :b 0]))

;; record-set! has side effect:

(begin
  (= record [:a 0 :b 0])
  (record-set! 'a 1 record)
  (record-set! 'b 2 record)
  (assert-equal record [:a 1 :b 2]))
