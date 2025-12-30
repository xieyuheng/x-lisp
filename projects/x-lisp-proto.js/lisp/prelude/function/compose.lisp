(export compose)

(claim compose
  (*-> (-> any? any?)
       (-> any? any?)))

(define compose
  (lambda fs
    (if (list-empty? fs)
      (lambda (x) x)
      (lambda (x)
        ((apply compose (list-init fs))
         ((list-last fs) x))))))
