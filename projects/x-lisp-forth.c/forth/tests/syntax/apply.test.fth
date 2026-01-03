@define-function my-iadd ( x y )
  x y iadd
@end

@define-function my-isub ( x y )
  x y isub
@end

@define-function test
  1 @ref iadd 1 @apply ( iadd1 )
  2 iadd1 1 @apply
  3 @assert-equal

  1 @ref my-iadd 1 @apply ( iadd1 )
  2 iadd1 1 @apply
  3 @assert-equal

  2 1 @ref my-isub 2 @tail-apply
  false @assert
@end

@define-function main
  test 1 @assert-equal
@end
