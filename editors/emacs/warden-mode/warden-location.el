;;; warden-location.el --- Location navigation and folding for warden-mode -*- lexical-binding: t; -*-

;;; Code:

(require 'cl-lib)

(defun warden-highlight-locations (beg end)
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
         `(face warden-location-face
           mouse-face highlight
           help-echo ,(format "RET: jump to %s:%s:%s" file line col)
           warden-location t))
        (when (match-string 4)
          (add-text-properties (+ (match-beginning 4) 4) (match-end 4)
                               '(face error)))))))

(defun warden-collect-locations ()
  "Return sorted list of all warden-location start positions in buffer."
  (let ((locations nil)
        (pos (point-min)))
    (while (< pos (point-max))
      (let ((next (text-property-any pos (point-max) 'warden-location t)))
        (if next
            (let ((end (or (next-single-property-change next 'warden-location)
                           (point-max))))
              (push next locations)
              (setq pos end))
          (setq pos (point-max)))))
    (nreverse locations)))

(defun warden-jump-to-location-at (pos)
  "Jump to the file:line:col at POS in other window."
  (when (get-text-property pos 'warden-location)
    (let* ((end (or (next-single-property-change pos 'warden-location)
                    (point-max)))
           (str (buffer-substring-no-properties pos end))
           (parts (split-string str ":")))
      (when (>= (length parts) 3)
        (let* ((file (car parts))
               (line (string-to-number (nth 1 parts)))
               (col (string-to-number (nth 2 parts)))
               (full (expand-file-name file warden-work-dir)))
          (when (file-exists-p full)
            (find-file-other-window full)
            (goto-char (point-min))
            (forward-line (- line 1))
            (forward-char (- col 1))))))))

(defun warden-jump-to-location ()
  "Jump to file:line:col on the current line in other window."
  (interactive)
  (let ((pos (save-excursion
               (beginning-of-line)
               (text-property-any (point) (line-end-position) 'warden-location t))))
    (when pos
      (warden-jump-to-location-at pos))))

(defun warden-next-location ()
  "Move point to the next location in the buffer."
  (interactive)
  (let* ((locations (warden-collect-locations))
         (next (or (cl-find-if (lambda (p) (> p (point))) locations)
                   (car locations))))
    (when next
      (goto-char next)
      (recenter))))

(defun warden-prev-location ()
  "Move point to the previous location in the buffer."
  (interactive)
  (let* ((locations (warden-collect-locations))
         (prev (or (cl-find-if (lambda (p) (< p (point))) locations :from-end t)
                   (car (last locations)))))
    (when prev
      (goto-char prev)
      (recenter))))

(defun warden-location-at-line ()
  "Return the warden-location position on the current line, or nil."
  (save-excursion
    (beginning-of-line)
    (text-property-any (point) (line-end-position) 'warden-location t)))

(defun warden-block-body-region (location-pos)
  "Return cons (BODY-START . BODY-END) for block at LOCATION-POS."
  (save-excursion
    (goto-char location-pos)
    (end-of-line)
    (let* ((body-start (1+ (point)))
           (locations (warden-collect-locations))
           (next (cl-find-if (lambda (p) (> p location-pos)) locations))
           (body-end (if next
                         (save-excursion
                           (goto-char next)
                           (line-beginning-position))
                       (point-max))))
      (when (< body-start body-end)
        (cons body-start body-end)))))

(defun warden-block-folded-p (location-pos)
  "Return non-nil if the block at LOCATION-POS is folded."
  (let ((region (warden-block-body-region location-pos)))
    (when region
      (cl-some (lambda (ov) (overlay-get ov 'warden-fold))
               (overlays-at (car region))))))

(defun warden-fold-block (location-pos)
  "Fold the body of the block at LOCATION-POS."
  (let ((region (warden-block-body-region location-pos)))
    (when region
      (let ((ov (make-overlay (car region) (cdr region))))
        (overlay-put ov 'invisible t)
        (overlay-put ov 'warden-fold t)))))

(defun warden-unfold-block (location-pos)
  "Unfold the body of the block at LOCATION-POS."
  (let ((region (warden-block-body-region location-pos)))
    (when region
      (dolist (ov (overlays-at (car region)))
        (when (overlay-get ov 'warden-fold)
          (delete-overlay ov))))))

(defun warden-unfold-all-blocks ()
  "Unfold all error blocks in the buffer."
  (dolist (ov (overlays-in (point-min) (point-max)))
    (when (overlay-get ov 'warden-fold)
      (delete-overlay ov))))

(defun warden-any-block-folded-p ()
  "Return non-nil if any block in the buffer is folded."
  (let ((result nil)
        (pos (point-min)))
    (while (and (not result) (< pos (point-max)))
      (let ((next (text-property-any pos (point-max) 'warden-location t)))
        (if next
            (progn
              (when (warden-block-folded-p next)
                (setq result t))
              (setq pos (or (next-single-property-change next 'warden-location)
                            (point-max))))
          (setq pos (point-max)))))
    result))

(defun warden-toggle-block ()
  "Toggle folding of the error block at point."
  (interactive)
  (let ((pos (warden-location-at-line)))
    (when pos
      (if (warden-block-folded-p pos)
          (warden-unfold-block pos)
        (warden-fold-block pos)))))

(defun warden-toggle-all-blocks ()
  "Toggle folding of all error blocks."
  (interactive)
  (if (warden-any-block-folded-p)
      (warden-unfold-all-blocks)
    (dolist (pos (warden-collect-locations))
      (warden-fold-block pos))))

(provide 'warden-location)
;;; warden-location.el ends here
