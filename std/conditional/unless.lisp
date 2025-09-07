(export unless)

;; (unless) can only take fixed number of arguments,
;; just like (if).

(define-lazy (unless p f) (if p void f))
