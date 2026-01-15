@define-function main
  make-hash ( hash₁ )
  hash₁ println make-hash ( hash₁ )
  1 2 hash₁ hash-put! hash₁ println make-hash ( hash₁ )
  1 3 hash₁ hash-put! hash₁ println make-hash ( hash₁ )
  1
  2
  hash₁
  hash-put!
  3
  4
  hash₁
  hash-put!
  hash₁
  @tail-call println
  
@end


