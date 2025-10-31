(import-all "ppml")

(export
  pretty
  pretty-print)

(claim pretty-print
  (-> int-non-negative? anything?
      void?))

(define (pretty-print max-width value)
  (write (pretty max-width value))
  (write "\n"))

(claim pretty
  (-> int-non-negative? anything?
      string?))

(define (pretty max-width value)
  (ppml-format max-width (render value)))

(claim render (-> anything? ppml-node?))

(define (render value)
  (cond ((atom? value)
         (text-node (format value)))
        ((and (set? anything? value)
              (set-empty? value))
         (text-node "{}"))
        ((set? anything? value)
         (= elements (indent-node 1 (render-elements (set-to-list value))))
         (group-node (concat-node [(text-node "{") elements (text-node "}")])))
        ((and (list? anything? value)
              (list-empty? value)
              (record-empty? value))
         (text-node "[]"))
        ((and (list? anything? value)
              (record-empty? value))
         (= elements (indent-node 1 (render-elements value)))
         (group-node (concat-node [(text-node "[") elements (text-node "]")])))
        ((and (record? anything? value)
              (list-empty? value))
         (= attributes (indent-node 1 (render-attributes (record-entries value))))
         (group-node (concat-node [(text-node "[") attributes (text-node "]")])))
        ((record? anything? value)
         (= elements (indent-node 1 (render-elements value)))
         (= attributes (indent-node 1 (render-attributes (record-entries value))))
         (group-node
          (concat-node
           [(text-node "[")
            (group-node elements)
            (indent-node 1 (break-node " "))
            attributes
            (text-node "]")])))
        ((and (hash? anything? anything? value)
              (hash-empty? value))
         (text-node "(@hash)"))
        ((hash? anything? anything? value)
         (= entries (indent-node 2 (render-hash-entries (hash-entries value))))
         (group-node
          (concat-node
           [(text-node "(@hash")
            (indent-node 2 (break-node " "))
            entries
            (text-node ")")])))
        (else (text-node (format value)))))

(define (render-elements elements)
  (match elements
    ([] null-node)
    ([element] (render element))
    ((cons element tail)
     (concat-node
      [(render element)
       (break-node " ")
       (render-elements tail)]))))

(define (render-key key)
  (text-node (string-append ":" (symbol-to-string key))))

(define (render-attribute key value)
  (group-node
   (concat-node
    [(render-key key)
     (break-node " ")
     (render value)])))

(define (render-attributes entries)
  (match entries
    ([] null-node)
    ([[key value]]
     (render-attribute key value))
    ((cons [key value] tail)
     (concat-node
      [(render-attribute key value)
       (break-node " ")
       (render-attributes tail)]))))

(define (render-hash-entry key value)
  (group-node
   (concat-node
    [(render key)
     (break-node " ")
     (render value)])))

(define (render-hash-entries entries)
  (match entries
    ([] null-node)
    ([[key value]]
     (render-hash-entry key value))
    ((cons [key value] tail)
     (concat-node
      [(render-hash-entry key value)
       (break-node " ")
       (render-hash-entries tail)]))))
