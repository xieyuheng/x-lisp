(begin
  (= path (path-join [(current-module-directory) "example.txt"]))
  (= text (file-get path))
  (assert-equal "abc\n" text)

  (file-set! path "123\n")
  (= text (file-get path))
  (assert-equal "123\n" text)

  (file-set! path "abc\n")
  (= text (file-get path))
  (assert-equal "abc\n" text))
