# machine-lisp.js

## syntax

```lisp
;;; top level statement

(define-code <name> <block> ...)
(define-data <name> <directive> ...)
(define-space <name> <size>)

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

;;; directive

(db <byte> ...)
(dw <word> ...)
(dd <double-word> ...)
(dq <quadruple-word> ...)
(string <string>)
(int <int>)
(float <float>)
(pointer <name>)
```
