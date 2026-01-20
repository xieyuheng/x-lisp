@define-function main
  1
  #t 
  @if 1 @else #t  @if 2 @else #f @assert @then @then
  @assert-equal
  2
  #f 
  @if 1 @else #t  @if 2 @else #f @assert @then @then
  @assert-equal
  #t 
  @if
    true @assert @else
    #t  @if false @assert @else #f @assert @then @then
  #f 
  @if
    false @assert @else
    #t  @if true @assert @else #f @assert @then @then
  
@end


