@begin
  make-list [list]

  list list-copy list @assert-equal
  list list-length 0 @assert-equal

  1 list list-push! @drop
  2 list list-push! @drop
  3 list list-push! @drop

  list list-copy list @assert-equal
  list list-length 3 @assert-equal

  list list-pop! 3 @assert-equal
  list list-pop! 2 @assert-equal
  list list-pop! 1 @assert-equal

  1 list list-push! @drop
  2 list list-push! @drop
  3 list list-push! @drop
  list list-shift! 1 @assert-equal
  list list-shift! 2 @assert-equal
  list list-shift! 3 @assert-equal

  1 list list-unshift! @drop
  2 list list-unshift! @drop
  3 list list-unshift! @drop
  list list-shift! 3 @assert-equal
  list list-shift! 2 @assert-equal
  list list-shift! 1 @assert-equal

  1 list list-unshift! @drop
  2 list list-unshift! @drop
  3 list list-unshift! @drop
  list list-pop! 1 @assert-equal
  list list-pop! 2 @assert-equal
  list list-pop! 3 @assert-equal
@end
