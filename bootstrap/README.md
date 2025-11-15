# x-lisp / bootstrap compiler

## x-lisp

### syntax

```lisp
;;; parser level syntax sugar

;; '<sexp> => (@quote <sexp>)
;; `<sexp> => (@quasiquote <sexp>)
;; ,<sexp> => (@unquote <sexp>)
;; [<elements> <attributes>] => (@tael <elements> <attributes>)
;; {<elements>} => (@set <elements>)

;;; top level statement

;; (claim <name> <schema>)
;; (define <name> <exp>)
(define (<name> <parameters>) <body>)
;; (define-data <predicate> <constructors>)
(import <source> <names>)
(import-all <source>)
(import-except <source> <names>)
(import-as <source> <prefix>)
(export <names>)
(include <source> <names>)
(include-all <source>)
(include-except <source> <names>)
(include-as <source> <prefix>)

;;; expression

(lambda (<parameters>) <body>)
;; (= <lhs> <rhs>)
;; (the <schema> <exp>)
;; (@tael <elements> <attributes>)
;; (@list <elements>)
;; (@record <attributes>)
;; (@set <elements>)
;; (@hash <key-value-pairs>)
;; (tau <elements>)
(begin <body>)
;; (cond <cond-lines>)
;; (match <target> <match-lines>)
;; (-> <arg-schemas> <ret-schema>)
;; (@quote <sexp>)
;; (@quasiquote <sexp>)
;; (@pattern <pattern>)
;; (polymorphic (<parameters>) <schema>)
;; (specific <target> <args>)
(if <condition> <consequent> <alternative>)
(when <condition> <consequent>)
(unless <condition> <consequent>)
(and <exps>)
(or <exps>)
;; (assert <exp>)
;; (assert-not <exp>)
;; (assert-equal <lhs> <rhs>)
;; (assert-not-equal <lhs> <rhs>)
;; (assert-the <schema> <exp>)
(<target> <args>)
```

###

## basic-lisp

## machine-lisp
