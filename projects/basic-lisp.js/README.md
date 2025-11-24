# basic-lisp

## syntax

```lisp
;;; top level statement

(define-function <name> <block> ...)
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
(= <dest> (const <value>))
(assert <condition>)
(return <var>)
(goto <label>)
(branch <var> <label> <label>)
(= <dest> (call <function> <var> ...))
(= <dest> (nullary-apply <var>))
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
```
