(import-all "optional")

(assert ((optional? int?) 1))
(assert ((optional? int?) null))
