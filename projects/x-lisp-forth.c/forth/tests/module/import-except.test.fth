@import-except "module-three" three @end

@def three 3 @end

@def main
  one 1 @assert-equal
  two 2 @assert-equal
  three 3 @assert-equal
@end
