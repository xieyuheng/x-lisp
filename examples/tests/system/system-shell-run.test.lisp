(begin
  (= command "ls -la")
  (= [:exit-code exit-code :stdout stdout] (system-shell-run command))
  (assert (equal? 0 exit-code))
  (println [:message "testing (system-shell-run)" :command command])
  (write stdout))
