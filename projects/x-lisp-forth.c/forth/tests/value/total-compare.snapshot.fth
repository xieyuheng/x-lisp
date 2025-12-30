@def snapshot ( lhs rhs )
  lhs print @drop
  " <=> " write @drop
  rhs print @drop
  " = " write @drop
  lhs rhs total-compare println @drop
@end

@def main
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
  1 list list-push! @drop
  2 list list-push! @drop
  1 list list-push! @drop
  list
@end

@def tael-1
  make-list ( list )
  1 list list-push! @drop
  2 list list-push! @drop
  3 list list-push! @drop
  'a 1 list record-put! @drop
  'c 3 list record-put! @drop
  list
@end

@def tael-2
  make-list ( list )
  1 list list-push! @drop
  2 list list-push! @drop
  3 list list-push! @drop
  'a 1 list record-put! @drop
  'b 2 list record-put! @drop
  'c 3 list record-put! @drop
  list
@end

@def tael-3
  make-list ( list )
  1 list list-push! @drop
  2 list list-push! @drop
  3 list list-push! @drop
  'c 3 list record-put! @drop
  'b 2 list record-put! @drop
  'a 1 list record-put! @drop
  list
@end
