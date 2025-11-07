(export pipe)

(claim pipe
  (-> anything?
      (*-> (-> anything? anything?)
           anything?)))

(define (pipe x)
  (lambda fs
    (if (list-empty? fs) x
        ((apply (pipe ((list-head fs) x)))
         (list-tail fs)))))
