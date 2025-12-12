@def iadd1
  1 iadd
@end

@def main
  1 @tail-call iadd1
  iadd1
@end

1 main println
