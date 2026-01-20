@define-function main
  make-hash ( hash₁ )
  hash₁ println @drop make-hash ( hash₁ )
  1
  2
  hash₁
  hash-put!
  @drop
  hash₁
  println
  @drop
  make-hash
  ( hash₁ )
  1
  3
  hash₁
  hash-put!
  @drop
  hash₁
  println
  @drop
  make-hash
  ( hash₁ )
  1
  2
  hash₁
  hash-put!
  @drop
  3
  4
  hash₁
  hash-put!
  @drop
  hash₁
  @tail-call println
  
@end


