@define-function snapshot ( value )
  value print @drop
  " => " write @drop
  value hash-code println @drop
@end

@define-function main
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

  make-set snapshot
  set-1 snapshot
  set-2 snapshot
  set-3 snapshot
  set-nested snapshot

  make-hash snapshot
  hash-1 snapshot
  hash-2 snapshot
  hash-3 snapshot
  hash-nested-1 snapshot
  hash-nested-2 snapshot
@end

@define-function list-1
  make-list ( list )
  1 list list-push! @drop
  2 list list-push! @drop
  3 list list-push! @drop
  list
@end

@define-function list-2
  make-list ( list )
  'a list list-push! @drop
  'b list list-push! @drop
  'c list list-push! @drop
  list
@end

@define-function list-3
  make-list ( list )
  "a" list list-push! @drop
  "b" list list-push! @drop
  "c" list list-push! @drop
  list
@end

@define-function list-nested
  make-list ( list )
  list-1 list list-push! @drop
  list-2 list list-push! @drop
  list-3 list list-push! @drop
  list
@end

@define-function record-1
  make-record ( record )
  'a 1 record record-put! @drop
  'b 2 record record-put! @drop
  'c 3 record record-put! @drop
  record
@end

@define-function record-2
  make-record ( record )
  'c 3 record record-put! @drop
  'b 2 record record-put! @drop
  'a 1 record record-put! @drop
  record
@end

@define-function record-3
  make-record ( record )
  'a 1 record record-put! @drop
  'b 2 record record-put! @drop
  'c 3 record record-put! @drop
  'x null record record-put! @drop
  record
@end

@define-function record-nested
  make-record ( record )
  'a record-1 record record-put! @drop
  'b record-2 record record-put! @drop
  'c record-3 record record-put! @drop
  record
@end

@define-function set-1
  make-set ( set )
  1 set set-add! @drop
  2 set set-add! @drop
  3 set set-add! @drop
  set
@end

@define-function set-2
  make-set ( set )
  3 set set-add! @drop
  2 set set-add! @drop
  1 set set-add! @drop
  set
@end

@define-function set-3
  make-set ( set )
  "a" set set-add! @drop
  "b" set set-add! @drop
  "c" set set-add! @drop
  set
@end

@define-function set-nested
  make-set ( set )
  set-1 set set-add! @drop
  set-2 set set-add! @drop
  set-3 set set-add! @drop
  set
@end

@define-function hash-1
  make-hash ( hash )
  'a 1 hash hash-put! @drop
  'b 2 hash hash-put! @drop
  'c 3 hash hash-put! @drop
  hash
@end

@define-function hash-2
  make-hash ( hash )
  'c 3 hash hash-put! @drop
  'b 2 hash hash-put! @drop
  'a 1 hash hash-put! @drop
  hash
@end

@define-function hash-3
  make-hash ( hash )
  'a 1 hash hash-put! @drop
  'b 2 hash hash-put! @drop
  hash
@end

@define-function hash-nested-1
  make-hash ( hash )
  hash-1 hash-1 hash hash-put! @drop
  hash-2 hash-2 hash hash-put! @drop
  hash-3 hash-3 hash hash-put! @drop
  hash
@end

@define-function hash-nested-2
  make-hash ( hash )
  hash-3 hash-3 hash hash-put! @drop
  hash-2 hash-2 hash hash-put! @drop
  hash-1 hash-1 hash hash-put! @drop
  hash
@end
