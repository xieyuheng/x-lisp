(begin
  (= [:exit-code exit-code :stdout stdout] (system-shell-run "ls" ["-la"]))
  (assert (equal? 0 exit-code))
  (println [:message "testing (system-shell-run)"])
  (write stdout))
