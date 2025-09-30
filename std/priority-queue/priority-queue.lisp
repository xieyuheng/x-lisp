(export
  priority-queue?
  make-priority-queue
  priority-queue-get)

(define-data (priority-queue? K P)
  (cons-priority-queue
   (compare (-> P sort-order?))
   (priority-hash (hash? K P))
   (index-hash (hash? K int?))
   (complete-binary-tree (list? int?))))

(claim make-priority-queue
  (polymorphic (K P)
    (-> (-> P sort-order?)
        (priority-queue? K P))))

(define (make-priority-queue compare)
  (cons-priority-queue compare (@hash) (@hash) (@list)))

(claim priority-queue-get
  (polymorphic (K P)
    (-> K (priority-queue? K P)
        (optional? P))))

(define (priority-queue-get key queue)
  (hash-get key (cons-priority-queue-priority-hash queue)))
