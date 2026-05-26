;;; meta-lisp-format.el --- Format meta-lisp files using meta-lisp-mode -*- lexical-binding: t; -*-

(defun meta-lisp-format-file (filename)
  "Format FILENAME as meta-lisp code and save in-place."
  (find-file filename)
  (meta-lisp-mode)
  (indent-region (point-min) (point-max))
  (save-buffer)
  (message "Formatted %s" filename))

(provide 'meta-lisp-format)
;;; meta-lisp-format.el ends here
