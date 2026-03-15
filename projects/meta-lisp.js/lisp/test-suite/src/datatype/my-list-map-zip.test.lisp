(import-all "my-list")
(import-all "my-list-map-zip")

(define (main)
  (assert-equal nil (my-list-map-zip iadd nil nil))
  (assert-equal
    (li 2 (li 4 (li 6 nil)))
    (my-list-map-zip
     iadd
     (li 1 (li 2 (li 3 nil)))
     (li 1 (li 2 (li 3 nil)))))

  (assert-equal nil (my-list-map-zip-2 iadd nil nil))
  (assert-equal
    (li 2 (li 4 (li 6 nil)))
    (my-list-map-zip-2
     iadd
     (li 1 (li 2 (li 3 nil)))
     (li 1 (li 2 (li 3 nil))))))
