(assert-equal "a-b-c" (string-replace "/" "-" "a/b/c"))
(assert-equal "a-b/c" (string-replace-first "/" "-" "a/b/c"))
