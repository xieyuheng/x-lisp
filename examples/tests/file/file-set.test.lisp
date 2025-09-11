(begin
  (= path (path-join [(current-module-directory) "example-2.txt"]))
  (= text (file-load path))
  (assert-equal "abc\n" text)

  (file-save path "123\n")
  (= text (file-load path))
  (assert-equal "123\n" text)

  (file-save path "abc\n")
  (= text (file-load path))
  (assert-equal "abc\n" text))
