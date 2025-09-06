(begin
  (= path (path-join [(current-module-directory) "example.txt"]))
  (= text (file-get path))
  (assert-equal "abc\n" text))
