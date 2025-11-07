(import-all "union")

(assert ((union string? symbol?) 'abc))
(assert ((union string? symbol?) "abc"))
