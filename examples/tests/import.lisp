(import id compose (rename compose c) "compose.lisp")

(compose (compose id id) (compose id id))
(c (c id id) (c id id))
