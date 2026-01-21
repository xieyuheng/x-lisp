@define-function main
  #t
  @if
    1
  @else
    2
  @then
  1
  @assert-equal
  #void
  @drop
  #f
  @if
    1
  @else
    2
  @then
  2
  @assert-equal
  #void
  @drop
  #t
  @if
    #t @if #t @else #f @then
  @else
    #f
  @then
  @assert
  #void
  @drop
  #t
  @if
    #t @if #f @else #f @then
  @else
    #f
  @then
  not
  @assert
  #void
  @drop
  #f
  @if
    #t
  @else
    #f @if #t @else #t @then
  @then
  @assert
  #void
  @drop
  #f
  @if
    #t
  @else
    #f @if #t @else #f @then
  @then
  not
  @assert
  #void
@end

