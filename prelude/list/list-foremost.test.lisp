(import-all "list-foremost")

(assert-equal 1 (list-foremost int-compare/ascending [1 2 3]))
(assert-equal 3 (list-foremost int-compare/descending [1 2 3]))

(assert-equal 3 (list-rearmost int-compare/ascending [1 2 3]))
(assert-equal 1 (list-rearmost int-compare/descending [1 2 3]))
