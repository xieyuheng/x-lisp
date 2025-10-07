(import-all "ppml")

(export
  pretty-format
  pretty-print)

(claim pretty-print
  (-> int-non-negative? anything?
      void?))

(define (pretty-print max-width value)
  (writeln (pretty-format max-width value)))

(claim pretty-format
  (-> int-non-negative? anything?
      string?))

(define (pretty-format max-width value)
  (ppml-format max-width (pretty-render value)))

(claim pretty-render (-> anything? ppml-node?))

(define (pretty-render value)
  (cond ((atom? value)
         (text-node (format value)))
        ((set? anything? value)
         (= elements (indent-node 1 (pretty-render-elements (set-to-list value))))
         (group-node (concat-node [(text-node "{") elements (text-node "}")])))
        ((list? anything? value)
         (= elements (indent-node 1 (pretty-render-elements value)))
         (group-node (concat-node [(text-node "[") elements (text-node "]")])))
        (else (text-node (format value)))))

(define (pretty-render-elements list)
  (match list
    ([] null-node)
    ([element] (pretty-render element))
    ((cons head tail)
     (append-node
      (append-node (pretty-render head)
                   (break-node " "))
      (pretty-render-elements tail)))))
