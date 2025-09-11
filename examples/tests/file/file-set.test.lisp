(begin
  (= path (path-join [(current-module-directory) "example-2.txt"]))
  (= text (file-load path))
  (assert-equal "abc\n" text)

  (file-set! path "123\n")
  (= text (file-load path))
  (assert-equal "123\n" text)

  (file-set! path "abc\n")
  (= text (file-load path))
  (assert-equal "abc\n" text))
