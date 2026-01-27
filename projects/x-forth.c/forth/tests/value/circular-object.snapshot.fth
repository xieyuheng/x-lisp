@define-function main
  make-list ( list )
  1 list list-push! @drop
  2 list list-push! @drop
  3 list list-push! @drop
  list list list-push! @drop
  list println @drop

  make-set ( set )
  1 set set-add! @drop
  2 set set-add! @drop
  3 set set-add! @drop
  set set set-add! @drop
  set println @drop
@end
