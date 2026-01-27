@define-function iadd1
  1 iadd @return
  false @assert
@end

@define-function main
  1 iadd1 2 @assert-equal
@end
