@define-function main
  #t 
  @if 1 @else 2 @then
  1
  @assert-equal
  #void
  @drop
  #f 
  @if 1 @else 2 @then
  2
  @assert-equal
  #void
  
@end


