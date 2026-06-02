;;; watch-mode.el --- Watch mode for running CLI watch scripts -*- lexical-binding: t; -*-

;; Author: The meta-lisp project
;; URL: https://github.com/xieyuheng/meta-lisp
;; Version: 0.1.0
;; Package-Requires: ((emacs "25.1"))

;;; Commentary:

;; A read-only major mode for running watch scripts (like `watch.sh`)
;; that properly handles terminal clear-screen sequences.
;;
;; When the watched process outputs a clear-screen sequence
;; (e.g., from `entr -c` or `tsc --watch`), the buffer is truly
;; erased before appending new output, preventing the buffer from
;; growing indefinitely.
;;
;; Usage:
;;   M-x watch
;;
;; Keybindings:
;;   q        - quit (kill process and buffer)
;;   g        - restart the watch process
;;   C-c C-k  - kill process (keep buffer)
;;   C-c C-c  - kill process and quit

;;; Code:

(defgroup watch nil
  "Watch mode for running command-line watch scripts."
  :group 'tools)

(defcustom watch-default-command "./scripts/watch.sh"
  "Default command to run with `watch'."
  :type 'string
  :group 'watch)

(defcustom watch-buffer-name "*watch*"
  "Name of the watch buffer."
  :type 'string
  :group 'watch)

(defcustom watch-auto-scroll t
  "Non-nil means automatically scroll to end of watch output."
  :type 'boolean
  :group 'watch)

(defvar-keymap watch-mode-map
  :parent special-mode-map
  "q"       #'watch-quit
  "g"       #'watch-restart
  "C-c C-k" #'watch-kill-process
  "C-c C-c" #'watch-quit)

(defvar-local watch--command nil
  "Command being watched.")
(defvar-local watch--process nil
  "Process running the watch command.")
(defvar-local watch--pending ""
  "Incomplete escape sequence from previous filter call.")

(defconst watch--clear-screen-regex
  (concat "\\(?:\e\\[H\e\\[2J\\|\e\\[2J\e\\[H"
          "\\|\e\\[2J\e\\[1;1H\\|\e\\[1;1H\e\\[2J"
          "\\|\e\\[3J\\|\e\\[2J\\|\ec\\)")
  "Regexp matching ANSI clear-screen sequences.")

;;; Utility functions (pure, testable)

(defun watch--partial-escape (string)
  "Return trailing incomplete escape sequence in STRING, or empty string.
Handles the case where an ANSI sequence is split across filter calls."
  (if (string-match "\e\\(?:\\[[0-9;]*\\|\\]\\)?$" string)
      (match-string 0 string)
    ""))

(defun watch--last-clear-end (string)
  "Return position after the last clear-screen sequence in STRING.
Returns nil if no clear-screen sequence is found."
  (let ((pos 0)
        (last-end nil))
    (while (string-match watch--clear-screen-regex string pos)
      (setq last-end (match-end 0))
      (setq pos (match-end 0)))
    last-end))

(defun watch--strip-ansi (string)
  "Remove ANSI escape sequences from STRING for clean display."
  (setq string (replace-regexp-in-string "\e\\[[0-9;]*[A-Za-z@-~]" "" string))
  (setq string (replace-regexp-in-string "\ec" "" string))
  string)

;;; Process management

(defun watch--filter (proc output)
  "Process filter for watch mode.
Handles clear-screen detection, partial escape sequences, and ANSI stripping."
  (when (buffer-live-p (process-buffer proc))
    (with-current-buffer (process-buffer proc)
      (let ((inhibit-read-only t))
        ;; Prepend any partial escape sequence from previous call
        (when (> (length watch--pending) 0)
          (setq output (concat watch--pending output))
          (setq watch--pending ""))
        ;; Save trailing incomplete escape sequence for next call
        (setq watch--pending (watch--partial-escape output))
        (when (> (length watch--pending) 0)
          (setq output (substring output 0 (- (length watch--pending)))))
        ;; Handle clear-screen sequences
        (let ((clear-end (watch--last-clear-end output)))
          (when clear-end
            (erase-buffer)
            (setq output (substring output clear-end))))
        ;; Strip remaining ANSI sequences
        (setq output (watch--strip-ansi output))
        ;; Insert cleaned output
        (save-excursion
          (goto-char (point-max))
          (insert output))
        ;; Auto-scroll to end
        (when watch-auto-scroll
          (goto-char (point-max)))))))

(defun watch--sentinel (proc event)
  "Process sentinel for watch mode.
Inserts exit status message when process terminates."
  (when (buffer-live-p (process-buffer proc))
    (with-current-buffer (process-buffer proc)
      (let ((inhibit-read-only t))
        (save-excursion
          (goto-char (point-max))
          (insert (format "\n*** Process `%s' %s ***\n"
                          (process-name proc)
                          (string-trim event))))))))

(defun watch--start-process (command)
  "Start a process running COMMAND in the current watch buffer."
  (let ((process (start-process-shell-command
                  "watch" (current-buffer) command)))
    (setq watch--process process)
    (setq watch--command command)
    (set-process-filter process #'watch--filter)
    (set-process-sentinel process #'watch--sentinel)))

;;; User commands

(defun watch-kill-process ()
  "Kill the watch process, if any."
  (interactive)
  (when (and watch--process
             (process-live-p watch--process))
    (kill-process watch--process)
    (setq watch--process nil)))

(defun watch-quit ()
  "Kill watch process and quit the watch buffer."
  (interactive)
  (watch-kill-process)
  (when (buffer-live-p (current-buffer))
    (kill-buffer (current-buffer))))

(defun watch-restart ()
  "Restart the watch process, clearing the buffer."
  (interactive)
  (watch-kill-process)
  (let ((inhibit-read-only t))
    (erase-buffer))
  (setq watch--pending "")
  (let ((command watch--command))
    (unless command
      (setq command (read-string "Watch command: "
                                 watch-default-command nil
                                 watch-default-command))
      (setq watch--command command))
    (watch--start-process command)))

;;; Major mode definition

(define-derived-mode watch-mode special-mode "Watch"
  "Major mode for running watch scripts with clear-screen handling.

\\{watch-mode-map}"
  (setq-local watch--command nil)
  (setq-local watch--process nil)
  (setq-local watch--pending ""))

(defun watch (command)
  "Run COMMAND as a watch script and display output in a read-only buffer.
Interactively, prompt for COMMAND, defaulting to `watch-default-command'."
  (interactive
   (list (read-string "Watch command: "
                      watch-default-command nil
                      watch-default-command)))
  (let ((buffer (get-buffer-create watch-buffer-name)))
    (with-current-buffer buffer
      (watch-mode)
      (setq watch--command command)
      (watch-kill-process)
      (let ((inhibit-read-only t))
        (erase-buffer)
        (setq watch--pending ""))
      (watch--start-process command))
    (display-buffer buffer)))

(provide 'watch-mode)
;;; watch-mode.el ends here
