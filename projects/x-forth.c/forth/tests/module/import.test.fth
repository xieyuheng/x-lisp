@import "module-one" one @end
@import "module-two" two @end

@define-function main
  one 1 @assert-equal
  two 2 @assert-equal
@end
