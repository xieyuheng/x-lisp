(export pipe)

(claim pipe
  (-> any?
      (*-> (-> any? any?)
           any?)))

(define (pipe x)
  (lambda fs
    (if (list-empty? fs) x
        ((apply (pipe ((list-head fs) x)))
         (list-tail fs)))))
