(import
  nil
  nil?
  li
  li?
  li-head
  li-tail
  "my-list.lisp")

nil
(li 1 (li 2 (li 3 nil)))

(assert (nil? nil))
(assert (li? (li 1 (li 2 (li 3 nil)))))

(assert (not (li? nil)))
(assert (not (nil? (li 1 (li 2 (li 3 nil))))))

(assert (equal? nil nil))

(assert (equal? (li 1 (li 2 (li 3 nil)))
                (li 1 (li 2 (li 3 nil)))))

(assert (equal? (li-tail (li 1 nil))
                nil))

(assert (equal? (li-head (li 1 nil))
                1))
