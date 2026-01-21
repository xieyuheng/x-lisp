@define-function main
  random-dice
  1
  equal?
  @if
    random-dice 2 equal?
  @else
    #f
  @then
  @if
    0
  @else
    42
  @then
  @tail-call println
@end

