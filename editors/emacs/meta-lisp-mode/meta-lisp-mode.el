;;; meta-lisp-mode.el --- Major mode for meta-lisp -*- lexical-binding: t; -*-

;; Author: The meta-lisp project
;; URL: https://github.com/xieyuheng/meta-lisp
;; Version: 0.1.0
;; Package-Requires: ((emacs "25.1"))

;;; Commentary:

;; Major mode for editing meta-lisp source files (.meta).
;;
;; Features:
;; - Syntax highlighting for special forms, types, keywords, etc.
;; - Indentation engine with proper support for meta-lisp's keyword forms
;; - S-expression navigation via syntax table (supports both () and [])
;; - Comment handling (; ...)
;;
;; Setup:
;;   (require 'meta-lisp-mode)
;;   ;; .meta files are associated automatically.
;;
;; Or manually:
;;   M-x meta-lisp-mode

;;; Code:

(require 'meta-lisp-syntax)
(require 'meta-lisp-indent)
(require 'meta-lisp-font-lock)

(defgroup meta-lisp nil
  "Editing support for meta-lisp source files."
  :group 'languages)

;;;###autoload
(define-derived-mode meta-lisp-mode prog-mode "MetaLisp"
  "Major mode for editing meta-lisp source code.

\\{meta-lisp-mode-map}"
  ;; Syntax
  (set-syntax-table meta-lisp-mode-syntax-table)
  (setq-local multibyte-syntax-as-symbol t)
  (setq-local parse-sexp-ignore-comments t)

  ;; Comments
  (setq-local comment-start ";")
  (setq-local comment-add 1)        ; default to ;; in comment-region
  (setq-local comment-start-skip ";+ *")
  (setq-local comment-column 40)
  (setq-local font-lock-comment-start-skip ";+ *")

  ;; Indentation
  (setq-local indent-line-function #'meta-lisp-indent-line)
  (setq-local indent-tabs-mode nil)

  ;; Font-lock
  (setq-local font-lock-defaults
              (list 'meta-lisp-font-lock-keywords
                    nil    ; keywords-only
                    nil    ; case-fold
                    nil    ; syntax-alist
                    nil))  ; syntax-begin

  ;; Misc
  (setq-local paragraph-start (concat "$\\|" page-delimiter))
  (setq-local paragraph-separate paragraph-start)
  (setq-local fill-paragraph-function #'lisp-fill-paragraph)
  (setq-local adaptive-fill-mode nil)

  ;; Hide-show (code folding)
  (add-to-list 'hs-special-modes-alist
               '(meta-lisp-mode "(" ")" ";" nil nil)))

;;;###autoload
(add-to-list 'auto-mode-alist '("\\.meta\\'" . meta-lisp-mode))

;;;###autoload
(add-to-list 'interpreter-mode-alist '("meta-lisp" . meta-lisp-mode))

(provide 'meta-lisp-mode)
;;; meta-lisp-mode.el ends here
