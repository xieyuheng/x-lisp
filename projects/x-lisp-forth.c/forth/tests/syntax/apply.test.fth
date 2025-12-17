@def my-iadd [x y]
  x y iadd
@end

@def my-isub [x y]
  x y isub
@end

@def main
  1 @ref iadd 1 @apply [iadd1]
  2 iadd1 1 @apply
  3 @assert-equal

  1 @ref my-iadd 1 @apply [iadd1]
  2 iadd1 1 @apply
  3 @assert-equal

  2 1 @ref my-isub 2 @tail-apply
  false @assert
@end

main 1 @assert-equal
