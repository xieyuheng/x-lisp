(export
  ppml-node?
  null-node text-node append-node
  indent-node break-node group-node
  concat-node
  ppml-format)

(define-data ppml-node?
  null-node
  (text-node (content string?))
  (append-node (left ppml-node?) (right ppml-node?))
  (indent-node (length int-non-negative?) (node ppml-node?))
  (break-node (space string?))
  (group-node (node ppml-node?)))

(claim concat-node
  (-> (list? ppml-node?)
      ppml-node?))

(define (concat-node nodes)
  (match nodes
    ([] null-node)
    ([node] node)
    ((cons head tail)
     (append-node head (concat-node tail)))))

(define-data grouping-mode?
  grouping-inline
  grouping-block)

(claim ppml-format
  (-> int-non-negative? ppml-node?
      string?))

(define (ppml-format max-width node)
  (= target [0 grouping-inline (group-node node)])
  (layout max-width 0 [target]))

(define layouting-target?
  (tau int-non-negative? grouping-mode? ppml-node?))

(claim layout
  (-> int-non-negative?
      int-non-negative?
      (list? layouting-target?)
      string?))

(define (layout max-width cursor targets)
  (cond ((list-empty? targets) "")
        (else
         (match (car targets)
           ([indentation mode null-node]
            (layout max-width
                    cursor
                    (cdr targets)))
           ([indentation mode (text-node content)]
            (string-append
             content
             (layout max-width
                     (iadd cursor (string-length content))
                     (cdr targets))))
           ([indentation mode (append-node left right)]
            (layout max-width
                    cursor
                    (cons [indentation mode left]
                          (cons [indentation mode right]
                                (cdr targets)))))
           ([indentation mode (indent-node length node)]
            (layout max-width
                    cursor
                    (cons [(iadd indentation length) mode node]
                          (cdr targets))))
           ([indentation grouping-inline (break-node space)]
            (string-append
             space
             (layout max-width
                     (iadd cursor (string-length space))
                     (cdr targets))))
           ([indentation grouping-block (break-node space)]
            (string-append
             (string-append "\n" (format-indentation indentation))
             (layout max-width
                     indentation
                     (cdr targets))))
           ([indentation mode (group-node node)]
            (= nodes [node])
            (= grouping-mode
               (if (fit? (isub max-width cursor) nodes)
                 grouping-inline
                 grouping-block))
            (layout max-width
                    indentation
                    (cons [indentation grouping-mode node]
                          (cdr targets))))))))

(claim format-indentation
  (-> int-non-negative?
      string?))

(define (format-indentation i)
  (if (equal? i 0)
    ""
    (string-append " " (format-indentation (isub i 1)))))

(claim fit?
  (-> int? (list? ppml-node?)
      bool?))

(define (fit? width nodes)
  (cond ((int-smaller? width 0) false)
        ((list-empty? nodes) true)
        (else
         (match (car nodes)
           (null-node
            (fit? width
                  (cdr nodes)))
           ((text-node content)
            (fit? (isub width (string-length content))
                  (cdr nodes)))
           ((append-node left right)
            (fit? width
                  (cons left (cons right (cdr nodes)))))
           ((indent-node length node)
            (fit? width
                  (cons node (cdr nodes))))
           ((break-node space)
            (fit? (isub width (string-length space))
                  (cdr nodes)))
           ((group-node node)
            (fit? width
                  (cons node (cdr nodes))))))))
