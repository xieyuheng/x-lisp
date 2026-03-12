(import-all "my-list")

(export-all)

(claim my-list-append
  (polymorphic (E)
    (-> (my-list-t E) (my-list-t E)
        (my-list-t E))))

(define (my-list-append left right)
  (match left
    (nil right)
    ((li head tail) (li head (my-list-append tail right)))))
