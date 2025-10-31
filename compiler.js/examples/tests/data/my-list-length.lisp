(import-all "my-list")

(export length)

(define (length target)
  (match target
    (nil 0)
    ((li head tail) (iadd 1 (length tail)))))
