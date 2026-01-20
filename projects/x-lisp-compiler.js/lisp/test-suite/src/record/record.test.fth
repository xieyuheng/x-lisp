@define-function main
  make-list ( tael₁ )
  'x
  'a
  tael₁
  record-put!
  @drop
  'y
  'b
  tael₁
  record-put!
  @drop
  tael₁
  make-list
  ( tael₁ )
  'x
  'a
  tael₁
  record-put!
  @drop
  'y
  'b
  tael₁
  record-put!
  @drop
  tael₁
  @assert-equal
  #void
  
@end


