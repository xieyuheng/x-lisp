@begin
  make-list [list]

  list anything-list? @assert

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

  1 list list-push! @drop
  2 list list-push! @drop
  3 list list-push! @drop
  0 list list-get 1 @assert-equal
  1 list list-get 2 @assert-equal
  2 list list-get 3 @assert-equal
  0 11 list list-put! @drop
  1 22 list list-put! @drop
  2 33 list list-put! @drop
  0 list list-get 11 @assert-equal
  1 list list-get 22 @assert-equal
  2 list list-get 33 @assert-equal
@end
