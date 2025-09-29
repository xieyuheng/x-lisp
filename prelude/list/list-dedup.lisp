(export list-dedup)

(define (list-dedup list)
  (pipe list
    list-to-set
    set-to-list))
