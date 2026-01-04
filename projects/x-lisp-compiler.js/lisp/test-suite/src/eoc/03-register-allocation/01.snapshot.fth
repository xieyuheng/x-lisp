@define-function main
  1 ( v₁ )
  42 ( w₁ )
  v₁ 7 iadd ( x₁ )
  x₁ ( y₁ )
  x₁ w₁ iadd ( z₁ )
  z₁ y₁ ineg iadd @tail-call println 
@end


