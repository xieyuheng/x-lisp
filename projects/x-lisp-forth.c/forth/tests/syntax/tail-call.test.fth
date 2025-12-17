@def iadd1
  1 iadd
@end

@def f1
  @tail-call iadd1
  false @assert
@end

1 f1 2 @assert-equal

@def f2
  1 @tail-call iadd1
  false @assert
@end

1 f2 2 @assert-equal
