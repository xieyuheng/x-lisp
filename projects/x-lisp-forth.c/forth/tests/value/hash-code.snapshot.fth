@def snapshot ( value )
  value print @drop
  " => " write @drop
  value hash-code println @drop
@end

@def main
  1 snapshot

  1.0 snapshot

  "" snapshot
  "abc" snapshot

  'abc snapshot

  #abc snapshot
  #t snapshot
  #f snapshot
  #void snapshot
  #null snapshot

  make-list snapshot

  list-1 snapshot
  list-2 snapshot
  list-3 snapshot
  list-nested snapshot

  record-1 snapshot
  record-2 snapshot
  record-3 snapshot
  record-nested snapshot

  record-1 hash-code record-2 hash-code @assert-equal
  record-3 hash-code record-2 hash-code @assert-equal
@end

@def list-1
  make-list ( list )
  1 list list-push! @drop
  2 list list-push! @drop
  3 list list-push! @drop
  list
@end

@def list-2
  make-list ( list )
  'a list list-push! @drop
  'b list list-push! @drop
  'c list list-push! @drop
  list
@end

@def list-3
  make-list ( list )
  "a" list list-push! @drop
  "b" list list-push! @drop
  "c" list list-push! @drop
  list
@end

@def list-nested
  make-list ( list )
  list-1 list list-push! @drop
  list-2 list list-push! @drop
  list-3 list list-push! @drop
  list
@end

@def record-1
  make-record ( record )
  'a 1 record record-put! @drop
  'b 2 record record-put! @drop
  'c 3 record record-put! @drop
  record
@end

@def record-2
  make-record ( record )
  'c 3 record record-put! @drop
  'b 2 record record-put! @drop
  'a 1 record record-put! @drop
  record
@end

@def record-3
  make-record ( record )
  'a 1 record record-put! @drop
  'b 2 record record-put! @drop
  'c 3 record record-put! @drop
  'x null record record-put! @drop
  record
@end

@def record-nested
  make-record ( record )
  'a record-1 record record-put! @drop
  'b record-2 record record-put! @drop
  'c record-3 record record-put! @drop
  record
@end
