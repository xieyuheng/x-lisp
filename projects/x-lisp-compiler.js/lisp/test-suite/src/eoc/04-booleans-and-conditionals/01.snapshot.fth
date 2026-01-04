@define-function main
  random-dice ( x₁ )
  random-dice ( y₁ )
  @if y₁ 2 iadd @else y₁ 10 iadd @then @tail-call println 
@end


