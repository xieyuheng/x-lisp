(assert (not (negate string? "abc")))
(assert (negate string? 'abc))

(assert ((union-fn [string? symbol?]) 'abc))
(assert ((union-fn [string? symbol?]) "abc"))

(assert (not ((inter-fn [string? symbol?]) 'abc)))
(assert (not ((inter-fn [string? symbol?]) "abc")))
