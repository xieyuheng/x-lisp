(begin
  (= [:exit-code exit-code :stdout stdout] (system-shell-run "echo" ["hello"]))
  (assert (equal? 0 exit-code))
  (assert-equal stdout "hello\n"))
