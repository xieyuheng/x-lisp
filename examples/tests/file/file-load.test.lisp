(begin
  (= path (path-join [(current-module-directory) "example.txt"]))
  (= text (file-load path))
  (assert-equal "abc\n" text))
