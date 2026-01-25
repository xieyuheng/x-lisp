@define-function gcd
  ( a b )
  b
  0
  equal?
  @if
    a
    @return
  @else
    b
    a
    b
    imod
    @tail-call gcd
  @then
@end

@define-function main
  1
  13
  7
  gcd
  @assert-equal
  #void
  @drop
  4
  12
  8
  gcd
  @assert-equal
  #void
@end

