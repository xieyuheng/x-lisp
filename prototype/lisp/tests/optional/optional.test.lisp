(assert ((optional? int?) 1))
(assert ((optional? int?) null))
(assert-not ((optional? int?) "a"))
