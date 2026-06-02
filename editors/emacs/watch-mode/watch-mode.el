;;; watch-mode.el --- Watch a directory and run commands on changes -*- lexical-binding: t; -*-

;; Author: The meta-lisp project
;; URL: https://github.com/xieyuheng/meta-lisp
;; Version: 0.1.0
;; Package-Requires: ((emacs "25.1"))

;;; Commentary:

;; Watch a directory for file changes and automatically re-run a shell
;; command, displaying the output in a read-only buffer.
;;
;; Usage:
;;   M-x watch
;;   ;; Prompts for directory to watch and shell command to run.
;;
;;   ;; From Lisp:
;;   (watch "src" "./scripts/check.sh")

;;; Code:

(require 'cl-lib)

(defgroup watch nil
  "Watch a directory and run commands on changes."
  :group 'tools)

(defcustom watch-debounce-interval 0.3
  "Debounce interval in seconds before re-running command."
  :type 'float
  :group 'watch)

(defface watch-loc-face
  '((t :inherit link))
  "Face for file:line:col locations in watch output.")

(defvar watch-command-history nil
  "History list for `watch' command input.")

(defvar-local watch--watchers nil
  "List of file-notify watch descriptors.")

(defvar-local watch--timer nil
  "Debounce timer.")

(defvar-local watch--process nil
  "Current running process.")

(defvar-local watch--dir nil
  "Directory being watched.")

(defvar-local watch--work-dir nil
  "Working directory for the command.")

(defvar-local watch--command nil
  "Shell command to run.")

(defun watch--cleanup ()
  "Remove all file watches and kill running process."
  (when watch--timer
    (cancel-timer watch--timer)
    (setq watch--timer nil))
  (when watch--process
    (when (process-live-p watch--process)
      (kill-process watch--process))
    (setq watch--process nil))
  (dolist (w watch--watchers)
    (when (file-notify-valid-p w)
      (file-notify-rm-watch w)))
  (setq watch--watchers nil))

(defun watch--run-command (buf)
  "Run the shell command and display output in BUF."
  (when (buffer-live-p buf)
    (with-current-buffer buf
      (when (and watch--process (process-live-p watch--process))
        (kill-process watch--process)
        (setq watch--process nil))
      (let ((inhibit-read-only t))
        (erase-buffer)
        (insert (propertize "---\n" 'face 'font-lock-comment-face))
        (watch--insert-fm-line "directory" (abbreviate-file-name watch--dir))
        (watch--insert-fm-line "command" watch--command)
        (watch--insert-fm-line "date" (format-time-string "%Y-%m-%d %H:%M:%S"))
        (insert (propertize "status:" 'face 'font-lock-keyword-face) " ")
        (insert (propertize "running..." 'watch-fm-status t 'face 'font-lock-doc-face) "\n")
        (insert (propertize "---\n" 'face 'font-lock-comment-face))
        (insert "\n"))
      (let ((default-directory watch--work-dir)
            (proc-buf (generate-new-buffer " *watch-output*")))
        (setq watch--process
              (make-process
               :name "watch-cmd"
               :buffer proc-buf
               :command (list shell-file-name shell-command-switch watch--command)
               :sentinel
               (lambda (proc _event)
                 (let* ((exit-code (process-exit-status proc))
                        (output (with-current-buffer (process-buffer proc)
                                  (buffer-string)))
                        (status-str (if (zerop exit-code)
                                        (format "ok (%d)" exit-code)
                                      (format "error (%d)" exit-code)))
                        (status-face (if (zerop exit-code) 'success 'error)))
                   (kill-buffer (process-buffer proc))
                   (when (buffer-live-p buf)
                     (with-current-buffer buf
                       (setq watch--process nil)
                       (let ((inhibit-read-only t))
                         (save-excursion
                           (goto-char (point-min))
                           (let ((pos (text-property-any (point-min) (point-max)
                                                         'watch-fm-status t)))
                             (when pos
                               (goto-char pos)
                               (let ((end (next-single-property-change
                                           pos 'watch-fm-status)))
                                 (delete-region pos end)
                                 (goto-char pos)
                                 (insert (propertize status-str
                                                     'watch-fm-status t
                                                     'face status-face))))))
                         (goto-char (point-max))
                         (let ((start (point)))
                           (insert output)
                           (watch--highlight-locations start (point)))
                         (goto-char (point-max)))))))
               :file-handler t))))))

(defun watch--insert-fm-line (key value)
  "Insert KEY: VALUE line in the front matter."
  (insert (propertize (format "%s:" key) 'face 'font-lock-keyword-face))
  (insert (format " %s\n" value)))

(defun watch--highlight-locations (beg end)
  "Highlight file:line:col patterns between BEG and END."
  (save-excursion
    (goto-char beg)
    (while (re-search-forward
            "\\([^ \t\n:]+\\):\\([0-9]+\\):\\([0-9]+\\)\\( -- .*\\)?" end t)
      (let* ((file (match-string 1))
             (line (match-string 2))
             (col (match-string 3))
             (col-end (match-end 3)))
        (add-text-properties
         (match-beginning 0) col-end
         `(face watch-loc-face
           mouse-face highlight
           help-echo ,(format "RET: jump to %s:%s:%s" file line col)
           watch-loc t))
        (when (match-string 4)
          (let ((sep-beg (match-beginning 4)))
            (add-text-properties sep-beg (+ sep-beg 4)
                                 '(face font-lock-comment-face))
            (add-text-properties (+ sep-beg 4) (match-end 4)
                                 '(face error))))))))

(defun watch--collect-locs ()
  "Return sorted list of all watch-loc start positions in buffer."
  (let ((locs nil)
        (pos (point-min)))
    (while (< pos (point-max))
      (let ((next (text-property-any pos (point-max) 'watch-loc t)))
        (if next
            (let ((end (or (next-single-property-change next 'watch-loc)
                           (point-max))))
              (push next locs)
              (setq pos end))
          (setq pos (point-max)))))
    (nreverse locs)))

(defun watch--jump-to-loc-at (pos)
  "Jump to the file:line:col at POS in other window."
  (when (get-text-property pos 'watch-loc)
    (let* ((end (or (next-single-property-change pos 'watch-loc)
                    (point-max)))
           (str (buffer-substring-no-properties pos end))
           (parts (split-string str ":")))
      (when (>= (length parts) 3)
        (let* ((file (car parts))
               (line (string-to-number (nth 1 parts)))
               (col (string-to-number (nth 2 parts)))
               (full (expand-file-name file watch--work-dir)))
          (when (file-exists-p full)
            (find-file-other-window full)
            (goto-char (point-min))
            (forward-line (- line 1))
            (forward-char (- col 1))))))))

(defun watch-jump-to-loc ()
  "Jump to file:line:col on the current line in other window."
  (interactive)
  (let ((pos (save-excursion
               (beginning-of-line)
               (text-property-any (point) (line-end-position) 'watch-loc t))))
    (when pos
      (watch--jump-to-loc-at pos))))

(defun watch-next-loc ()
  "Move point to the next location in the buffer."
  (interactive)
  (let* ((locs (watch--collect-locs))
         (next (or (cl-find-if (lambda (p) (> p (point))) locs)
                   (car locs))))
    (when next
      (goto-char next)
      (recenter))))

(defun watch-prev-loc ()
  "Move point to the previous location in the buffer."
  (interactive)
  (let* ((locs (watch--collect-locs))
         (prev (or (cl-find-if (lambda (p) (< p (point))) locs :from-end t)
                   (car (last locs)))))
    (when prev
      (goto-char prev)
      (recenter))))

(defun watch--on-change (event buf)
  "Handle file-notify EVENT for watch buffer BUF."
  (let ((action (nth 1 event)))
    (when (memq action '(changed created deleted renamed))
      (when (buffer-live-p buf)
        (with-current-buffer buf
          (when watch--timer
            (cancel-timer watch--timer))
          (setq watch--timer
                (run-with-timer watch-debounce-interval nil
                                (lambda ()
                                  (when (buffer-live-p buf)
                                    (with-current-buffer buf
                                      (setq watch--timer nil)
                                      (watch--run-command buf)))))))))))

(defun watch--setup-watches (dir buf)
  "Set up file-notify watches recursively for DIR, targeting BUF."
  (setq dir (expand-file-name dir))
  (let ((watchers nil))
    (cl-labels ((add-watch (d)
                  (let ((w (file-notify-add-watch d '(change)
                              (lambda (event)
                                (watch--on-change event buf)))))
                    (push w watchers))
                  (dolist (sub (directory-files d t directory-files-no-dot-files-regexp))
                    (when (file-directory-p sub)
                      (add-watch sub)))))
      (add-watch dir))
    watchers))

(defun watch-rerun ()
  "Manually re-run the watch command."
  (interactive)
  (watch--run-command (current-buffer)))

(define-derived-mode watch-mode special-mode "Watch"
  "Major mode for displaying watch command output.
\\{watch-mode-map}"
  (setq-local buffer-read-only t)
  (add-hook 'kill-buffer-hook #'watch--cleanup nil t))

(define-key watch-mode-map (kbd "<f5>") #'watch-rerun)
(define-key watch-mode-map (kbd "RET") #'watch-jump-to-loc)
(define-key watch-mode-map (kbd "M-n") #'watch-next-loc)
(define-key watch-mode-map (kbd "M-p") #'watch-prev-loc)
(define-key watch-mode-map (kbd "q") #'undefined)

;;;###autoload
(defun watch (watch-dir command)
  "Watch WATCH-DIR for file changes and re-run COMMAND on each change.

Interactively, prompts for the directory to watch and the shell
command to run.  Output is displayed in a read-only buffer named
`*watch: <dir>*'.

WATCH-DIR is relative to `default-directory' (or absolute).
COMMAND is run with `default-directory' as the working directory."
  (interactive
   (list
    (read-directory-name "Watch directory: " "src")
    (read-shell-command "Command: " "./scripts/check.sh" 'watch-command-history)))
  (let* ((work-dir (expand-file-name default-directory))
         (watch-dir (expand-file-name watch-dir))
         (buf-name (format "*watch: %s*" (abbreviate-file-name watch-dir))))
    (unless (file-directory-p watch-dir)
      (error "Not a directory: %s" watch-dir))
    (with-current-buffer (get-buffer-create buf-name)
      (watch-mode)
      (setq watch--dir watch-dir)
      (setq watch--work-dir work-dir)
      (setq watch--command command)
      (watch--cleanup)
      (setq watch--watchers (watch--setup-watches watch-dir (current-buffer)))
      (watch--run-command (current-buffer))
      (pop-to-buffer (current-buffer)))))

(provide 'watch-mode)
;;; watch-mode.el ends here
