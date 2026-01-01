@import "module-one.fth" one @end
@import "module-two.fth" two @end

@def main
  one 1 @assert-equal
  two 2 @assert-equal
@end
