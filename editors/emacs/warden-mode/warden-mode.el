;;; warden-mode.el --- Watch a directory and run commands on changes -*- lexical-binding: t; -*-

;; Author: The meta-lisp project
;; URL: https://github.com/xieyuheng/meta-lisp
;; Version: 0.1.0
;; Package-Requires: ((emacs "25.1"))

;;; Commentary:

;; Watch a directory for file changes and automatically re-run a shell
;; command, displaying the output in a read-only buffer.
;;
;; Usage:
;;   M-x warden
;;   ;; Prompts for directory to watch and shell command to run.
;;
;;   ;; From Lisp:
;;   (warden "src" "./scripts/check.sh")

;;; Code:

(require 'cl-lib)
(require 'warden-location)
(require 'warden-run)
(require 'warden-watch)

(defgroup warden nil
  "Watch a directory and run commands on changes."
  :group 'tools)

(defcustom warden-debounce-interval 0.3
  "Debounce interval in seconds before re-running command."
  :type 'float
  :group 'warden)

(defface warden-location-face
  '((t :inherit link))
  "Face for file:line:col locations in warden output.")

(defvar warden-command-history nil
  "History list for `warden' command input.")

(defvar-local warden-watchers nil
  "List of file-notify watch descriptors.")

(defvar-local warden-timer nil
  "Debounce timer.")

(defvar-local warden-process nil
  "Current running process.")

(defvar-local warden-dir nil
  "Directory being watched.")

(defvar-local warden-work-dir nil
  "Working directory for the command.")

(defvar-local warden-command nil
  "Shell command to run.")

(define-derived-mode warden-mode special-mode "Warden"
  "Major mode for displaying watch command output.
\\{warden-mode-map}"
  (setq-local buffer-read-only t)
  (add-hook 'kill-buffer-hook #'warden-cleanup nil t))

(define-key warden-mode-map (kbd "<f5>") #'warden-rerun)
(define-key warden-mode-map (kbd "RET") #'warden-jump-to-location)
(define-key warden-mode-map (kbd "M-n") #'warden-next-location)
(define-key warden-mode-map (kbd "M-p") #'warden-prev-location)
(define-key warden-mode-map (kbd "TAB") #'warden-toggle-block)
(define-key warden-mode-map (kbd "<backtab>") #'warden-toggle-all-blocks)
(define-key warden-mode-map (kbd "q") #'undefined)

;;;###autoload
(defun warden (watch-dir command)
  "Watch WATCH-DIR for file changes and re-run COMMAND on each change.

Interactively, prompts for the directory to watch and the shell
command to run.  Output is displayed in a read-only buffer named
`*warden: <dir>*'.

WATCH-DIR is relative to `default-directory' (or absolute).
COMMAND is run with `default-directory' as the working directory."
  (interactive
   (list
    (read-directory-name "Watch directory: " "src")
    (read-shell-command "Command: " "./scripts/check.sh" 'warden-command-history)))
  (let* ((work-dir (expand-file-name default-directory))
         (watch-dir (expand-file-name watch-dir))
         (buf-name (format "*warden: %s*" (abbreviate-file-name watch-dir))))
    (unless (file-directory-p watch-dir)
      (error "Not a directory: %s" watch-dir))
    (with-current-buffer (get-buffer-create buf-name)
      (warden-mode)
      (setq warden-dir watch-dir)
      (setq warden-work-dir work-dir)
      (setq warden-command command)
      (warden-cleanup)
      (setq warden-watchers (warden-setup-watches watch-dir (current-buffer)))
      (warden-run-command (current-buffer))
      (pop-to-buffer (current-buffer))
      (delete-other-windows))))

(provide 'warden-mode)
;;; warden-mode.el ends here
