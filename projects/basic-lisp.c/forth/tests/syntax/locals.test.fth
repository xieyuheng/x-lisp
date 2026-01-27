@define-function square ( x )
  x x imul
@end

@define-function my-isub ( x y )
  x y isub
@end

@define-function main
  2 square 4 @assert-equal
  2 square square 16 @assert-equal

  6 3 my-isub 3 @assert-equal
@end
