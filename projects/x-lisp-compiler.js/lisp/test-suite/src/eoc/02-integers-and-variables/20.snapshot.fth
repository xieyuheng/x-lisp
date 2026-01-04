@define-function main
  1 ( x₁ )
  x₁ 5 ( y₁ )
  y₁ x₁ iadd ( x₂ )
  x₂ 100 iadd iadd @tail-call println 
@end


