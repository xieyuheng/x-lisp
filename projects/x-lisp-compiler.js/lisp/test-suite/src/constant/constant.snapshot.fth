@define-variable one
  1 @return
@end

@define-variable two
  1 one @tail-call iadd
@end

@define-variable three
  1 two @tail-call iadd
@end

@define-function main
  three @tail-call println
@end

