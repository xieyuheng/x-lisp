(import-all "my-list")
(import-all "my-list-append")

(assert-equal (append nil nil) nil)
(assert-equal (append (li 1 (li 2 (li 3 nil)))
                      (li 4 (li 5 (li 6 nil))))
              (li 1 (li 2 (li 3 (li 4 (li 5 (li 6 nil)))))))

;; currying primitive function

(assert ((equal? (append nil nil)) nil))
(assert ((equal? (append (li 1 (li 2 (li 3 nil)))
                         (li 4 (li 5 (li 6 nil)))))
         (li 1 (li 2 (li 3 (li 4 (li 5 (li 6 nil))))))))

;; currying defined function

(assert-equal ((append nil) nil) nil)
(assert-equal ((append (li 1 (li 2 (li 3 nil))))
               (li 4 (li 5 (li 6 nil))))
              (li 1 (li 2 (li 3 (li 4 (li 5 (li 6 nil)))))))
