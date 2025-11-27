# basic-lisp

## syntax

```lisp
;;; top level statement

(define-function <name> <block> ...)
(define-variable <name>)
(define-variable <name> <value>)
(define-metadata <name> <chunk> ...)

;; module syntax statement

(import <source> <name> ...)
(import-all <source>)
(import-except <source> <name> ...)
(import-as <source> <prefix>)
(export <name> ...)
(include <source> <name> ...)
(include-all <source>)
(include-except <source> <name> ...)
(include-as <source> <prefix>)

;;; block

(block <name> <instr> ...)

;;; instruction

(= <dest> (argument <index>))
(= <dest> (literal <value>))
(assert <condition>)
(return <var>)
(goto <label>)
(branch <var> <label> <label>)
(= <dest> (call <function> <var> ...))
(= <dest> (apply-nullary <var>))
(= <dest> (apply <var> <var>))

;;; value

<symbol>
<hashtag>
<string>
<int>
<float>
(@function <name> <arity>)
(@primitive-function <name> <arity>)
(@curry <value> <arity> <arg> ...)
(@address <name>)

;;; chunk

(chunk <name> <directive> ...)

;;; directive

(string <string>)
(int <int>)
(float <float>)
(pointer <name>)
(string-pointer <string>)
```
