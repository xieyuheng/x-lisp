(import-all "list-each")

(list-each
 (lambda (x)
   (call print x)
   (write "\n"))
 [1 2 3])
