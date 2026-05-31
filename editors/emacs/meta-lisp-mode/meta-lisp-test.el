;;; meta-lisp-test.el --- Tests for meta-lisp-mode -*- lexical-binding: t; -*-

(require 'ert)
(require 'meta-lisp-mode)

;;; Helpers

(defun meta-lisp-test--indent (source)
  "Insert SOURCE into a meta-lisp-mode buffer, indent it, return result."
  (with-temp-buffer
    (meta-lisp-mode)
    (insert source)
    (indent-region (point-min) (point-max))
    (buffer-string)))

(defun meta-lisp-test--font-lock-at (source)
  "Return the face at the position marked by § in SOURCE.

SOURCE is meta-lisp code containing exactly one § character
marking the position to check. The buffer is fontified and the
face at that position is returned."
  (with-temp-buffer
    (meta-lisp-mode)
    (let ((pos (string-match "§" source)))
      (unless pos
        (error "Missing § marker in test source"))
      (insert (replace-regexp-in-string "§" "" source))
      (font-lock-mode 1)
      (font-lock-ensure)
      (let ((face (get-text-property (+ (point-min) pos) 'face)))
        (when face
          (if (consp face) (car face) face))))))

;;; Indentation tests -- top-level

(ert-deftest meta-lisp-indent-top-level ()
  "Top-level forms should have no indentation."
  (should (equal (meta-lisp-test--indent "(module example)")
                 "(module example)"))
  (should (equal (meta-lisp-test--indent "(define x 1)")
                 "(define x 1)")))

;;; Indentation -- spec=1 keywords

(ert-deftest meta-lisp-indent-define-fn ()
  "define with function form: body indented 2 from opening paren."
  (let ((result (meta-lisp-test--indent
                 "(define (f x)\n(println x)\n(iadd x 1))")))
    (should (equal result "(define (f x)\n  (println x)\n  (iadd x 1))"))))

(ert-deftest meta-lisp-indent-define-var ()
  "define with variable: body indented 2."
  (let ((result (meta-lisp-test--indent
                 "(define answer\n42)")))
    (should (equal result "(define answer\n  42)"))))

(ert-deftest meta-lisp-indent-lambda ()
  "lambda: params special, body indented 2."
  (let ((result (meta-lisp-test--indent
                 "(lambda (x y)\n(iadd x y))")))
    (should (equal result "(lambda (x y)\n  (iadd x y))"))))

(ert-deftest meta-lisp-indent-let ()
  "let: bindings special, body indented 2."
  (let ((result (meta-lisp-test--indent
                 "(let ((x 1)\n(y 2))\n(iadd x y))")))
    (should (equal result "(let ((x 1)\n      (y 2))\n  (iadd x y))"))))

(ert-deftest meta-lisp-indent-let-star ()
  "let*: same as let."
  (let ((result (meta-lisp-test--indent
                 "(let* ((x 1)\n(y (iadd x 1)))\n(iadd x y))")))
    (should (equal result "(let* ((x 1)\n       (y (iadd x 1)))\n  (iadd x y))"))))

(ert-deftest meta-lisp-indent-if ()
  "if: condition special, branches indented 2."
  (let ((result (meta-lisp-test--indent
                 "(if (equal? x 0)\n'zero\n'non-zero)")))
    (should (equal result "(if (equal? x 0)\n  'zero\n  'non-zero)"))))

(ert-deftest meta-lisp-indent-match ()
  "match: target special, clauses indented 2."
  (let ((result (meta-lisp-test--indent
                 "(match exp\n((var-exp name)\nbody)\n((apply-exp target arg)\nbody2))")))
    (should (equal result "(match exp\n  ((var-exp name)\n   body)\n  ((apply-exp target arg)\n   body2))"))))

(ert-deftest meta-lisp-indent-claim ()
  "claim: name special, body indented 2."
  (let ((result (meta-lisp-test--indent
                 "(claim add1\n(-> int-t int-t))")))
    (should (equal result "(claim add1\n  (-> int-t int-t))"))))

(ert-deftest meta-lisp-indent-when-unless ()
  "when and unless: condition special, body indented 2."
  (let ((result (meta-lisp-test--indent
                 "(when debug?\n(print \"debug\")\n(newline))")))
    (should (equal result "(when debug?\n  (print \"debug\")\n  (newline))"))))

;;; Indentation -- spec=0 keywords

(ert-deftest meta-lisp-indent-cond ()
  "cond: all clauses indented 2 from opening paren."
  (let ((result (meta-lisp-test--indent
                 "(cond\n((equal? x 1) 'one)\n(else 'other))")))
    (should (equal result "(cond\n  ((equal? x 1) 'one)\n  (else 'other))"))))

(ert-deftest meta-lisp-indent-begin ()
  "begin: all body forms indented 2."
  (let ((result (meta-lisp-test--indent
                 "(begin\n(println \"step 1\")\n(println \"step 2\")\n42)")))
    (should (equal result "(begin\n  (println \"step 1\")\n  (println \"step 2\")\n  42)"))))

(ert-deftest meta-lisp-indent-and ()
  "and: all forms indented 2."
  (let ((result (meta-lisp-test--indent
                 "(and\n(int? x)\n(int-positive? x))")))
    (should (equal result "(and\n  (int? x)\n  (int-positive? x))"))))

(ert-deftest meta-lisp-indent-or ()
  "or: all forms indented 2."
  (let ((result (meta-lisp-test--indent
                 "(or\n(equal? x 0)\n(equal? x 1))")))
    (should (equal result "(or\n  (equal? x 0)\n  (equal? x 1))"))))

(ert-deftest meta-lisp-indent-assert ()
  "assert-equal: all forms indented 2."
  (let ((result (meta-lisp-test--indent
                 "(assert-equal\n2\n(iadd 1 1))")))
    (should (equal result "(assert-equal\n  2\n  (iadd 1 1))"))))

;;; Indentation -- function calls

(ert-deftest meta-lisp-indent-function-call ()
  "Function call: arguments align with first argument."
  (let ((result (meta-lisp-test--indent
                 "(iadd 1\n2)")))
    (should (equal result "(iadd 1\n      2)"))))

(ert-deftest meta-lisp-indent-function-call-newline ()
  "Function call: function on its own line."
  (let ((result (meta-lisp-test--indent
                 "(iadd\n1\n2)")))
    (should (equal result "(iadd\n  1\n  2)"))))

;;; Indentation -- brackets [] and {}

(ert-deftest meta-lisp-indent-brackets ()
  "Brackets inside define: bracket body indented 2 from define."
  (let ((result (meta-lisp-test--indent
                 "(define xs\n[1 2 3])")))
    (should (equal result "(define xs\n  [1 2 3])"))))

(ert-deftest meta-lisp-indent-brackets-fn-call ()
  "Brackets in function calls: elements indented 2 from bracket."
  (let ((result (meta-lisp-test--indent
                 "(list-get-element\n[1 2 3]\n0)")))
    (should (equal result "(list-get-element\n  [1 2 3]\n  0)"))))

(ert-deftest meta-lisp-indent-brackets-multiline ()
  "Multi-line bracket literal: all elements align with first."
  (let ((result (meta-lisp-test--indent
                 "[1\n2\n3]")))
    (should (equal result "[1\n 2\n 3]"))))

(ert-deftest meta-lisp-indent-braces ()
  "Curly braces: all elements align with first."
  (let ((result (meta-lisp-test--indent
                 "{:a 1\n:b 2\n:c 3}")))
    (should (equal result "{:a 1\n :b 2\n :c 3}"))))

(ert-deftest meta-lisp-indent-brackets-nested ()
  "Brackets nested in paren forms."
  (let ((result (meta-lisp-test--indent
                 "(let ((xs [1\n2\n3]))\n(car xs))")))
    (should (equal result
                   "(let ((xs [1\n           2\n           3]))\n  (car xs))"))))

;;; Indentation -- nested

(ert-deftest meta-lisp-indent-nested-define ()
  "Nested defines should indent correctly."
  (let ((result (meta-lisp-test--indent
                 "(define (evaluate exp env)\n(match exp\n((var-exp name)\n(env-lookup name env)))))")))
    (should (equal result
                   "(define (evaluate exp env)\n  (match exp\n    ((var-exp name)\n     (env-lookup name env)))))"))))

(ert-deftest meta-lisp-indent-nested-let ()
  "Nested let forms."
  (let ((result (meta-lisp-test--indent
                 "(let ((x 1)\n(y 2))\n(let ((z 3))\n(iadd x z)))")))
    (should (equal result
                   "(let ((x 1)\n      (y 2))\n  (let ((z 3))\n    (iadd x z)))"))))

(ert-deftest meta-lisp-indent-define-test ()
  "define-test: name special, body indented 2."
  (let ((result (meta-lisp-test--indent
                 "(define-test my-test\n(assert-equal 2 (iadd 1 1))\n(assert true))")))
    (should (equal result
                   "(define-test my-test\n  (assert-equal 2 (iadd 1 1))\n  (assert true))"))))

(ert-deftest meta-lisp-indent-module-import ()
  "module and import forms."
  (let ((result (meta-lisp-test--indent
                 "(module my-module)\n(import math\npi\ncircumference)")))
    (should (equal result
                   "(module my-module)\n(import math\n  pi\n  circumference)"))))

(ert-deftest meta-lisp-indent-define-struct ()
  "define-struct: type-name special, fields indented 2."
  (let ((result (meta-lisp-test--indent
                 "(define-struct point-t\n(x float-t)\n(y float-t))")))
    (should (equal result
                   "(define-struct point-t\n  (x float-t)\n  (y float-t))"))))

(ert-deftest meta-lisp-indent-define-enum ()
  "define-enum: type-name special."
  (let ((result (meta-lisp-test--indent
                 "(define-enum exp-t\n(var-exp (name symbol-t))\n(apply-exp (target exp-t) (arg exp-t)))")))
    (should (equal result
                   "(define-enum exp-t\n  (var-exp (name symbol-t))\n  (apply-exp (target exp-t) (arg exp-t)))"))))

;;; Font-lock tests

(ert-deftest meta-lisp-font-lock-keyword ()
  "Special forms should use font-lock-keyword-face."
  (should (eq (meta-lisp-test--font-lock-at "(§define x 1)")
              'font-lock-keyword-face))
  (should (eq (meta-lisp-test--font-lock-at "(§lambda (x) x)")
              'font-lock-keyword-face))
  (should (eq (meta-lisp-test--font-lock-at "(§let ((x 1)) x)")
              'font-lock-keyword-face))
  (should (eq (meta-lisp-test--font-lock-at "(§if true 1 2)")
              'font-lock-keyword-face))
  (should (eq (meta-lisp-test--font-lock-at "(§-> int-t int-t)")
              'font-lock-keyword-face))
  (should (eq (meta-lisp-test--font-lock-at "(§else 42)")
              'font-lock-keyword-face)))

(ert-deftest meta-lisp-font-lock-function-name ()
  "define's name should use font-lock-function-name-face."
  (should (eq (meta-lisp-test--font-lock-at "(define (§f x) x)")
              'font-lock-function-name-face))
  (should (eq (meta-lisp-test--font-lock-at "(define §answer 42)")
              'font-lock-function-name-face))
  (should (eq (meta-lisp-test--font-lock-at "(claim §add1 (-> int-t int-t))")
              'font-lock-function-name-face)))

(ert-deftest meta-lisp-font-lock-at-form ()
  "@-prefixed forms should use meta-lisp-at-form-face."
  (let ((face (meta-lisp-test--font-lock-at "(§@list 1 2 3)")))
    (should (eq face 'meta-lisp-at-form-face))))

(ert-deftest meta-lisp-font-lock-at-comment ()
  "@comment should use font-lock-comment-face."
  (let ((face (meta-lisp-test--font-lock-at "(§@comment (lambda (x) x))")))
    (should (eq face 'font-lock-comment-face))))

(ert-deftest meta-lisp-font-lock-declare-primitive ()
  "declare-primitive forms should use font-lock-keyword-face."
  (should (eq (meta-lisp-test--font-lock-at "(§declare-primitive-function add1 1)")
              'font-lock-keyword-face))
  (should (eq (meta-lisp-test--font-lock-at "(§declare-primitive-variable pi)")
              'font-lock-keyword-face)))

(ert-deftest meta-lisp-font-lock-builtin-constant ()
  "Builtin constants should use font-lock-builtin-face."
  (let ((face (meta-lisp-test--font-lock-at "(if §true 1 2)")))
    (should (eq face 'font-lock-builtin-face)))
  (let ((face (meta-lisp-test--font-lock-at "(if §false 1 2)")))
    (should (eq face 'font-lock-builtin-face)))
  (let ((face (meta-lisp-test--font-lock-at "§void")))
    (should (eq face 'font-lock-builtin-face))))

(ert-deftest meta-lisp-font-lock-type ()
  "Type names (symbols ending in -t) should use font-lock-type-face."
  (let ((face (meta-lisp-test--font-lock-at "(claim x §point-t)")))
    (should (eq face 'font-lock-type-face))))

(ert-deftest meta-lisp-font-lock-keyword-no-partial ()
  "Keywords inside larger symbols should NOT trigger keyword face."
  (should-not (eq (meta-lisp-test--font-lock-at "(§lambda-term ...)")
                  'font-lock-keyword-face))
  (should-not (eq (meta-lisp-test--font-lock-at "(§let1-term ...)")
                  'font-lock-keyword-face))
  (should-not (eq (meta-lisp-test--font-lock-at "(§if-term ...)")
                  'font-lock-keyword-face))
  (should-not (eq (meta-lisp-test--font-lock-at "(§polymorphic-term ...)")
                  'font-lock-keyword-face)))

(ert-deftest meta-lisp-font-lock-keyword-constant ()
  "Keyword symbols (:xxx) should use font-lock-constant-face."
  (let ((face (meta-lisp-test--font-lock-at "(@hash §:a 1 :b 2)")))
    (should (eq face 'font-lock-constant-face))))

(ert-deftest meta-lisp-font-lock-module-prefix ()
  "Module prefix in qualified names should use module-name-face."
  (let ((face (meta-lisp-test--font-lock-at "(§sigma/pi 3.14)")))
    (should (eq face 'meta-lisp-module-name-face))))

(ert-deftest meta-lisp-font-lock-type-qualified ()
  "Qualified type: suffix gets type face, prefix gets module face."
  (let ((face (meta-lisp-test--font-lock-at "(math/§point-t x y)")))
    (should (eq face 'font-lock-type-face))))

;;; Comment tests

(ert-deftest meta-lisp-comment-syntax ()
  "Comments should be properly recognized."
  (with-temp-buffer
    (meta-lisp-mode)
    (insert ";; this is a comment\n(define x 1)")
    (goto-char 3)
    (should (nth 4 (syntax-ppss)))))

;;; S-expression tests

(ert-deftest meta-lisp-sexp-navigation ()
  "forward-sexp should work with both () and []."
  (with-temp-buffer
    (meta-lisp-mode)
    (insert "(define xs [1 2 3])")
    (goto-char (point-min))
    (forward-sexp 1)
    (should (eobp))))

(provide 'meta-lisp-test)
;;; meta-lisp-test.el ends here
