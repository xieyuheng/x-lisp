(import-all "my-list")

(claim main (-> void-t))

(define (main)
  ;; data constructor

  (assert-equal nil #nil)
  (assert-equal (li 1 (li 2 (li 3 nil)))
                [#li 1 [#li 2 [#li 3 #nil]]])

  ;; data getter

  (assert-equal (li-tail (li 1 nil)) nil)
  (assert-equal (li-head (li 1 nil)) 1)

  ;; data putter

  (= list (li 1 (li 2 (li 3 nil))))

  (assert-equal (li-head list) 1)
  (li-put-head! 111 list)
  (assert-equal (li-head list) 111)

  (assert-equal (li-tail list) (li 2 (li 3 nil)))
  (li-put-tail! nil list)
  (assert-equal (li-tail list) nil)
  
  ;; data constructor currying

  (assert-equal
    (li 1 nil)
    ((li 1) nil)))
