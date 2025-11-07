(import-all "inter")

(assert-not ((inter string? symbol?) 'abc))
(assert-not ((inter string? symbol?) "abc"))
