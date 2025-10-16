(export
  digraph?
  digraph-edge?
  make-empty-digraph)

(define-data (digraph? V)
  (cons-digraph
   (vertex-set (set? V))
   (direct-predecessor-hash (hash? V (set? V)))
   (direct-successor-hash (hash? V (set? V)))))

(define (digraph-edge? V) (tau V V))

(define digraph-vertex-set cons-digraph-vertex-set)
(define digraph-direct-predecessor-hash cons-digraph-direct-predecessor-hash)
(define digraph-direct-successor-hash cons-digraph-direct-successor-hash)

(claim make-empty-digraph
  (polymorphic (V) (-> (digraph? V))))

(define (make-empty-digraph)
  (cons-digraph (@set) (@hash) (@hash)))
