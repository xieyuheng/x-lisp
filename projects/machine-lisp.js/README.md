# machine-lisp.js

## syntax

```lisp
;;; top level statement

(define-code <name> <block> ...)
(define-data <name> <chunk> ...)

;;; block

(block <name> <instr> ...)

;;; instruction

(<op> <operand> ...)

;;; operand

(imm <int>)
(label-imm <label>)
(var <name>)
(reg <name>)
(reg-deref <reg> <offset>)
(label-deref <label>)
(label <name>)
(external-label <name>)
(cc <condition-code>)
(arity <int>)

;;; chunk

(chunk <name> <directive> ...)

;;; directive

(db <byte> ...)
(dw <word> ...)
(dd <double-word> ...)
(dq <quadruple-word> ...)
(string <string>)
```
