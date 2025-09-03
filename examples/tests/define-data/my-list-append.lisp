(import-all "my-list.lisp")

(export append)

(define (append target list)
  (match target
    (nil list)
    ((li head tail)
     (li head (append tail list)))))
