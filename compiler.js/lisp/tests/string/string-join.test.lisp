(assert-equal
  (string-join "" ["a" "b" "c"])
  "abc")

(assert-equal
  (string-join " " ["a" "b" "c"])
  "a b c")
