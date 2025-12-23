@begin
  make-list [list]

  list println

  list list-copy list @assert-equal
  list list-length 0 @assert-equal

  1 list list-push! @drop
  2 list list-push! @drop
  3 list list-push! @drop
  list println

  list list-copy list @assert-equal
  list list-length 3 @assert-equal
@end
