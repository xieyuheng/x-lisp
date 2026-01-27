@define-function iadd1
  1 iadd
@end

@define-function f1
  @tail-call iadd1
  false @assert
@end

@define-function f2
  1 @tail-call iadd1
  false @assert
@end

@define-function main
  1 f1 2 @assert-equal
  1 f2 2 @assert-equal
@end
