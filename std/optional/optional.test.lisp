(import-all "optional.lisp")

(assert ((optional? int?) 1))
(assert ((optional? int?) null))
