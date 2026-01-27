@import "square.fth" square @end

@define-function main
  2 square 4 @assert-equal
  3 square 9 @assert-equal
@end
