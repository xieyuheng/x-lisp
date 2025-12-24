@begin
  make-list [list]

  list anything-list? @assert

  list list-copy list @assert-equal
  list list-length 0 @assert-equal
  list list-empty? @assert

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

@begin
  make-list
  3 @swap cons
  2 @swap cons
  1 @swap cons [list]

  list car 1 @assert-equal
  list cdr car 2 @assert-equal
  list cdr cdr car 3 @assert-equal

  list list-head 1 @assert-equal
  list list-tail list-head 2 @assert-equal
  list list-tail list-tail list-head 3 @assert-equal
@end
