;; expected behavior:
;;   exit with "bye" instead return "end".

;; bug  behavior:
;;   return "end".

;; fix:
;;   walk the value in body of (begin),
;;   there might be side-effect in lazy value!

(begin
  (when true
    (exit "bye"))
  "end")
