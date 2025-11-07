(begin
  (= path (path-join [(current-module-directory) "file-3.txt"]))

  (assert-not (file-exists? path))
  (file-save path "abc\n")
  (assert (file-exists? path))
  (file-delete path)
  (assert-not (file-exists? path)))
