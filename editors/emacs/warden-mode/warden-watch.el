;;; warden-watch.el --- File watching for warden-mode -*- lexical-binding: t; -*-

;;; Code:

(require 'cl-lib)

(defun warden-cleanup ()
  "Remove all file watches and kill running process."
  (warden-unfold-all-blocks)
  (when warden-timer
    (cancel-timer warden-timer)
    (setq warden-timer nil))
  (when warden-process
    (when (process-live-p warden-process)
      (kill-process warden-process))
    (setq warden-process nil))
  (dolist (w warden-watchers)
    (when (file-notify-valid-p w)
      (file-notify-rm-watch w)))
  (setq warden-watchers nil))

(defun warden-on-change (event buf)
  "Handle file-notify EVENT for watch buffer BUF."
  (let ((action (nth 1 event)))
    (when (memq action '(changed created deleted renamed))
      (when (buffer-live-p buf)
        (with-current-buffer buf
          (when warden-timer
            (cancel-timer warden-timer))
          (setq warden-timer
                (run-with-timer warden-debounce-interval nil
                                (lambda ()
                                  (when (buffer-live-p buf)
                                    (with-current-buffer buf
                                      (setq warden-timer nil)
                                      (warden-run-command buf)))))))))))

(defun warden-setup-watches (dir buf)
  "Set up file-notify watches recursively for DIR, targeting BUF."
  (setq dir (expand-file-name dir))
  (let ((watchers nil))
    (cl-labels ((add-watch (d)
                  (let ((w (file-notify-add-watch d '(change)
                              (lambda (event)
                                (warden-on-change event buf)))))
                    (push w watchers))
                  (dolist (sub (directory-files d t directory-files-no-dot-files-regexp))
                    (when (file-directory-p sub)
                      (add-watch sub)))))
      (add-watch dir))
    watchers))

(provide 'warden-watch)
;;; warden-watch.el ends here
