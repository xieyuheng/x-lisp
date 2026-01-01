@import-all "index"

@def main
  one 1 @assert-equal
  two 2 @assert-equal
  three 3 @assert-equal

  m/one 1 @assert-equal
  m/two 2 @assert-equal
  m/three 3 @assert-equal
@end
