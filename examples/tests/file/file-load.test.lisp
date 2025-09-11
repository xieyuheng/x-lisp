(begin
  (= path (path-join [(current-module-directory) "example-1.txt"]))
  (= text (file-load path))
  (assert-equal "abc\n" text))
