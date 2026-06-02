;;; warden-run.el --- Command execution for warden-mode -*- lexical-binding: t; -*-

;;; Code:

(require 'cl-lib)

(defun warden-run-command (buf)
  "Run the shell command and display output in BUF."
  (when (buffer-live-p buf)
    (with-current-buffer buf
      (when (and warden-process (process-live-p warden-process))
        (kill-process warden-process)
        (setq warden-process nil))
      (let ((inhibit-read-only t))
        (warden-unfold-all-blocks)
        (erase-buffer)
        (insert "---\n")
        (warden-insert-fm-line "directory" (abbreviate-file-name warden-dir))
        (warden-insert-fm-line "command" warden-command)
        (warden-insert-fm-line "date" (format-time-string "%Y-%m-%d %H:%M:%S"))
        (insert (propertize "status:" 'face 'font-lock-keyword-face) " ")
        (insert (propertize "running..." 'warden-fm-status t 'face 'font-lock-doc-face) "\n")
        (insert "---\n")
        (insert "\n"))
      (let ((default-directory warden-work-dir)
            (proc-buf (generate-new-buffer " *warden-output*")))
        (setq warden-process
              (make-process
               :name "warden-cmd"
               :buffer proc-buf
               :command (list shell-file-name shell-command-switch warden-command)
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
                       (setq warden-process nil)
                       (let ((inhibit-read-only t))
                         (save-excursion
                           (goto-char (point-min))
                           (let ((pos (text-property-any (point-min) (point-max)
                                                         'warden-fm-status t)))
                             (when pos
                               (goto-char pos)
                               (let ((end (next-single-property-change
                                           pos 'warden-fm-status)))
                                 (delete-region pos end)
                                 (goto-char pos)
                                 (insert (propertize status-str
                                                     'warden-fm-status t
                                                     'face status-face))))))
                         (goto-char (point-max))
                         (let ((start (point)))
                           (insert output)
                           (warden-highlight-locations start (point))
                           (let ((first (text-property-any
                                         start (point) 'warden-location t)))
                             (if first
                                 (progn
                                   (goto-char first)
                                   (recenter))
                               (goto-char (point-max)))))))))
                :file-handler t)))))))

(defun warden-insert-fm-line (key value)
  "Insert KEY: VALUE line in the front matter."
  (insert (propertize (format "%s:" key) 'face 'font-lock-keyword-face))
  (insert (format " %s\n" value)))

(defun warden-rerun ()
  "Manually re-run the watch command."
  (interactive)
  (warden-run-command (current-buffer)))

(provide 'warden-run)
;;; warden-run.el ends here
