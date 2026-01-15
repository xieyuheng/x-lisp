@define-function main
  make-list ( list₁ )
  1
  list₁
  list-push!
  2
  list₁
  list-push!
  3
  list₁
  list-push!
  make-list
  ( tael₁ )
  1
  tael₁
  list-push!
  2
  tael₁
  list-push!
  3
  tael₁
  list-push!
  tael₁
  list₁
  @assert-equal
  make-list
  ( tael₁ )
  1
  tael₁
  list-push!
  2
  tael₁
  list-push!
  3
  tael₁
  list-push!
  tael₁
  make-list
  ( tael₁ )
  1
  tael₁
  list-push!
  2
  tael₁
  list-push!
  3
  tael₁
  list-push!
  tael₁
  @assert-equal
  make-list
  ( tael₁ )
  'a
  tael₁
  list-push!
  'b
  tael₁
  list-push!
  'c
  tael₁
  list-push!
  tael₁
  make-list
  ( tael₁ )
  'a
  tael₁
  list-push!
  'b
  tael₁
  list-push!
  'c
  tael₁
  list-push!
  tael₁
  @assert-equal
  3
  make-list
  ( tael₁ )
  1
  tael₁
  list-push!
  2
  tael₁
  list-push!
  3
  tael₁
  list-push!
  tael₁
  list-length
  @assert-equal
  0
  make-list
  ( tael₁ )
  tael₁ list-length @assert-equal make-list ( tael₁ )
  tael₁ list-empty? @assert 
@end


