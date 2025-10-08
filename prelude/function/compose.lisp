(export compose)

(define compose
  (lambda fs
    (if (list-empty? fs)
      (lambda (x) x)
      (lambda (x)
        ((apply compose (list-init fs))
         ((list-last fs) x))))))
