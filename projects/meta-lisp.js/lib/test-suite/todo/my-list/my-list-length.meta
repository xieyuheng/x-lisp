(import-all "my-list")

(export-all)

(claim my-list-length
  (polymorphic (E)
    (-> (my-list-t E)
        int-t)))

(define (my-list-length list)
  (match list
    (nil 0)
    ((li head tail) (iadd 1 (my-list-length tail)))))
