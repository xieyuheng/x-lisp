@import-except "module-three" three @end

@define-function three 3 @end

@define-function main
  one 1 @assert-equal
  two 2 @assert-equal
  three 3 @assert-equal
@end
