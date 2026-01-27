@define-function snapshot ( lhs rhs )
  lhs print @drop
  " <=> " write @drop
  rhs print @drop
  " = " write @drop
  lhs rhs total-compare println @drop
@end

@define-function main
  1 1 snapshot
  1 2 snapshot
  2 1 snapshot

  1 1.0 snapshot

  "abc" "abc" snapshot
  "abc" "def" snapshot

  'abc "abc" snapshot

  'abc 'abc snapshot
  'abc 'def snapshot

  #abc #abc snapshot
  #abc #def snapshot

  list-1 list-1 snapshot
  list-1 list-2 snapshot

  tael-1 tael-1 snapshot
  tael-1 tael-2 snapshot
  tael-1 tael-3 snapshot
  tael-2 tael-3 snapshot

  set-1 set-1 snapshot
  set-1 set-2 snapshot

  hash-1 hash-1 snapshot
  hash-1 hash-2 snapshot
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
  1 list list-push! @drop
  2 list list-push! @drop
  1 list list-push! @drop
  list
@end

@define-function tael-1
  make-list ( list )
  1 list list-push! @drop
  2 list list-push! @drop
  3 list list-push! @drop
  'a 1 list record-put! @drop
  'c 3 list record-put! @drop
  list
@end

@define-function tael-2
  make-list ( list )
  1 list list-push! @drop
  2 list list-push! @drop
  3 list list-push! @drop
  'a 1 list record-put! @drop
  'b 2 list record-put! @drop
  'c 3 list record-put! @drop
  list
@end

@define-function tael-3
  make-list ( list )
  1 list list-push! @drop
  2 list list-push! @drop
  3 list list-push! @drop
  'c 3 list record-put! @drop
  'b 2 list record-put! @drop
  'a 1 list record-put! @drop
  list
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
  1 set set-add! @drop
  2 set set-add! @drop
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
  'a 1 hash hash-put! @drop
  'b 2 hash hash-put! @drop
  hash
@end
