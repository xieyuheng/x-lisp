(export when)

(define-lazy (when p t) (if p t void))
