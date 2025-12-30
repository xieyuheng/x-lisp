@def echo-hash-code [value]
  value print " -> " write value hash-code println
@end

@def main
  1 echo-hash-code

  1.0 echo-hash-code

  "" echo-hash-code
  "abc" echo-hash-code

  'abc echo-hash-code

  #abc echo-hash-code
  #t echo-hash-code
  #f echo-hash-code
  #void echo-hash-code
  #null echo-hash-code

  make-list echo-hash-code

  list-1 echo-hash-code
  list-2 echo-hash-code
  list-3 echo-hash-code
  list-nested echo-hash-code

  record-1 echo-hash-code
  record-2 echo-hash-code
  record-3 echo-hash-code
  -- record-nested echo-hash-code

  record-1 echo-hash-code record-2 echo-hash-code @assert-equal
  record-3 echo-hash-code record-2 echo-hash-code @assert-equal
@end

@def list-1
  make-list [list]
  1 list list-push!
  2 list list-push!
  3 list list-push!
  list
@end

@def list-2
  make-list [list]
  'a list list-push!
  'b list list-push!
  'c list list-push!
  list
@end

@def list-3
  make-list [list]
  "a" list list-push!
  "b" list list-push!
  "c" list list-push!
  list
@end

@def list-nested
  make-list [list]
  list-1 list list-push!
  list-2 list list-push!
  list-3 list list-push!
  list
@end

@def record-1
  make-record [record]
  'a 1 record record-put!
  'b 2 record record-put!
  'c 3 record record-put!
  record
@end

@def record-2
  make-record [record]
  'c 3 record record-put!
  'b 2 record record-put!
  'a 1 record record-put!
  record
@end

@def record-3
  make-record [record]
  'a 1 record record-put!
  'b 2 record record-put!
  'c 3 record record-put!
  'x null record record-put!
  record
@end

@def record-nested
  make-record [record]
  'a record-1 record record-put!
  'b record-2 record record-put!
  'c record-3 record record-put!
  record
@end
