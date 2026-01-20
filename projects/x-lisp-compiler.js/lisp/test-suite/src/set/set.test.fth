@define-function main
  make-set ( set₁ )
  1
  set₁
  set-add!
  @drop
  2
  set₁
  set-add!
  @drop
  3
  set₁
  set-add!
  @drop
  set₁
  make-set
  ( set₁ )
  1
  set₁
  set-add!
  @drop
  2
  set₁
  set-add!
  @drop
  3
  set₁
  set-add!
  @drop
  set₁
  @assert-equal
  #void
  
@end


