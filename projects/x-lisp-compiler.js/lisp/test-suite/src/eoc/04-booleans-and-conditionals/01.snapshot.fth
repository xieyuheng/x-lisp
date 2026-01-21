@define-function main
  random-dice
  ( x₁ )
  random-dice
  ( y₁ )
  x₁
  1
  int-less?
  @if
    x₁ 0 equal?
  @else
    x₁ 2 equal?
  @then
  @if
    y₁ 2 iadd
  @else
    y₁ 10 iadd
  @then
  @tail-call println
@end

