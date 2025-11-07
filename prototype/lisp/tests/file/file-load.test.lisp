(begin
  (= path (path-join [(current-module-directory) "file-1.txt"]))

  (= text (file-load path))
  (assert-equal "abc\n" text)
  (assert-equal 4 (file-size path)))
