;;; watch-mode-test.el --- Tests for watch-mode -*- lexical-binding: t; -*-

(require 'ert)
(require 'watch-mode)

;;; Helpers

(defun watch-test--simulate (chunks)
  "Simulate processing a sequence of output CHUNKS through the filter.
Returns the final buffer contents as a string."
  (with-temp-buffer
    (watch-mode)
    (let ((inhibit-read-only t)
          (watch--pending ""))
      (dolist (chunk chunks)
        ;; Core filter logic (same as watch--filter without process)
        (let ((output chunk))
          (when (> (length watch--pending) 0)
            (setq output (concat watch--pending output))
            (setq watch--pending ""))
          (setq watch--pending (watch--partial-escape output))
          (when (> (length watch--pending) 0)
            (setq output (substring output 0 (- (length watch--pending)))))
          (let ((clear-end (watch--last-clear-end output)))
            (when clear-end
              (erase-buffer)
              (setq output (substring output clear-end))))
          (setq output (watch--strip-ansi output))
          (save-excursion
            (goto-char (point-max))
            (insert output))))
      (buffer-string))))

;;; Test: watch--partial-escape

(ert-deftest watch-partial-escape-none ()
  "No trailing escape sequence."
  (should (equal (watch--partial-escape "hello world") ""))
  (should (equal (watch--partial-escape "line1\nline2\n") ""))
  (should (equal (watch--partial-escape "") "")))

(ert-deftest watch-partial-escape-esc ()
  "Ends with bare ESC."
  (should (equal (watch--partial-escape "text\e") "\e")))

(ert-deftest watch-partial-escape-csi-prefix ()
  "Ends with incomplete CSI."
  (should (equal (watch--partial-escape "text\e[") "\e["))
  (should (equal (watch--partial-escape "text\e[1") "\e[1"))
  (should (equal (watch--partial-escape "text\e[1;") "\e[1;")))

(ert-deftest watch-partial-escape-complete-csi ()
  "Complete CSI sequences should NOT be detected as partial."
  (should (equal (watch--partial-escape "text\e[31m") ""))
  (should (equal (watch--partial-escape "\e[2J") ""))
  (should (equal (watch--partial-escape "\e[H\e[2J") "")))

;;; Test: watch--last-clear-end

(ert-deftest watch-last-clear-end-none ()
  "No clear-screen sequence."
  (should (null (watch--last-clear-end "normal output")))
  (should (null (watch--last-clear-end ""))))

(ert-deftest watch-last-clear-end-home-clear ()
  "ESC [ H ESC [ 2 J should be detected."
  (should (equal (watch--last-clear-end "\e[H\e[2J") 7))
  (should (equal (watch--last-clear-end "\e[H\e[2Joutput") 7)))

(ert-deftest watch-last-clear-end-clear-home ()
  "ESC [ 2 J ESC [ H should be detected."
  (should (equal (watch--last-clear-end "\e[2J\e[H") 7)))

(ert-deftest watch-last-clear-end-ris ()
  "ESC c should be detected."
  (should (equal (watch--last-clear-end "\ec") 2))
  (should (equal (watch--last-clear-end "\ecoutput") 2)))

(ert-deftest watch-last-clear-end-multiple ()
  "Only the last clear-screen sequence matters."
  (should (equal (watch--last-clear-end "\e[H\e[2Jfirst\e[2J\e[Hsecond") 19)))

;;; Test: watch--strip-ansi

(ert-deftest watch-strip-ansi-none ()
  "String without ANSI sequences should be unchanged."
  (should (equal (watch--strip-ansi "hello world") "hello world"))
  (should (equal (watch--strip-ansi "") "")))

(ert-deftest watch-strip-ansi-color ()
  "Color codes should be stripped."
  (should (equal (watch--strip-ansi "\e[31mred\e[0m") "red"))
  (should (equal (watch--strip-ansi "\e[1;32mbold green\e[0m") "bold green")))

(ert-deftest watch-strip-ansi-cursor ()
  "Cursor positioning codes should be stripped."
  (should (equal (watch--strip-ansi "\e[H") ""))
  (should (equal (watch--strip-ansi "\e[2J") ""))
  (should (equal (watch--strip-ansi "\e[1;1H") "")))

(ert-deftest watch-strip-ansi-ris ()
  "RIS (ESC c) should be stripped."
  (should (equal (watch--strip-ansi "\ec") ""))
  (should (equal (watch--strip-ansi "before\ec") "before")))

;;; Integration test: filter simulation

(ert-deftest watch-simulate-no-clear ()
  "Output without clear-screen is accumulated normally."
  (should (equal (watch-test--simulate '("line1\n" "line2\n" "line3\n"))
                 "line1\nline2\nline3\n")))

(ert-deftest watch-simulate-clear-resets-buffer ()
  "Clear-screen sequence should erase buffer and keep subsequent output."
  (should (equal (watch-test--simulate '("old output\n" "\e[H\e[2Jnew output\n"))
                 "new output\n"))
  (should (equal (watch-test--simulate '("old\n" "\e[2J\e[Hnew\n"))
                 "new\n")))

(ert-deftest watch-simulate-clear-with-color ()
  "Clear-screen combined with color codes."
  (should (equal (watch-test--simulate '("old\n" "\e[H\e[2J\e[32mgreen\e[0m\n"))
                 "green\n")))

(ert-deftest watch-simulate-multiple-clears ()
  "Multiple clears keep only content after the last one."
  (should (equal (watch-test--simulate '("a\n\e[H\e[2Jb\n\e[H\e[2Jc\n"))
                 "c\n")))

(ert-deftest watch-simulate-split-escape ()
  "Escape sequence split across filter calls should be handled."
  (should (equal (watch-test--simulate '("old\n\e[H\e[" "2Jnew\n"))
                 "new\n"))
  (should (equal (watch-test--simulate '("old\n\e[" "H\e[2Jnew\n"))
                 "new\n")))

(ert-deftest watch-simulate-ansi-stripped ()
  "ANSI sequences in normal output should be stripped."
  (should (equal (watch-test--simulate '("\e[Kcheck: \e[32mok\e[0m\n"))
                 "check: ok\n")))

(provide 'watch-mode-test)
;;; watch-mode-test.el ends here
