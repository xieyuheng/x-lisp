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

(writeln (ppml-format 30 example-node))
(writeln (ppml-format 20 example-node))
(writeln (ppml-format 10 example-node))
