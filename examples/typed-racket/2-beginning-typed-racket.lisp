(define-type tree-t (union leaf-t node-t))
(define-type leaf-t (tau 'leaf number-t))
(define-type node-t (tau 'node tree-t tree-t))

(claim tree-height (-> tree-t integer-t))
(define (tree-height tree)
  (match tree
    (['leaf _] 1)
    (['node left right]
     (max (add1 (tree-height left))
          (add1 (tree-height right))))))

(claim tree-sum (-> tree-t number-t))
(define (tree-sum tree)
  (match tree
    (['leaf value] value)
    (['node left right]
     (add (tree-sum left)
          (tree-sum right)))))
