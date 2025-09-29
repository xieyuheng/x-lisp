(export when)

;; (when) can only take fixed number of arguments,
;; just like (if).

(define-lazy (when p t) (if p t void))
