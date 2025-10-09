(import-all "../function")
(import-all "../string")
(import-all "../list")
(import-all "ppml")

(define example-node
  (concat-node
   [(text-node "begin")
    (indent-node
     3
     (append-node
      (break-node " ")
      (group-node
       (concat-node
        [(text-node "stmt")
         (break-node " ")
         (text-node "stmt")
         (break-node " ")
         (text-node "stmt")]))))
    (break-node " ")
    (text-node "end")]))

(define (test-widths widths node)
  (pipe widths
    (list-each
     (lambda (width)
       (write (string-repeat width "-"))
       (write "|")
       (writeln (format width))
       (writeln (ppml-format width node))))))

(test-widths [30 20 10] example-node)
