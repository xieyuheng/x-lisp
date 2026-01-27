@define-function abs ( x )
  x 0 int-less? @if
    x ineg
  @else
    x
  @then
@end

@define-function even? ( x )
  x abs ( x )
  x 0 equal? @if
    true
  @else
    x 1 equal? @if
      false
    @else
      x 2 isub @tail-call even? @return
    @then
  @then
@end

@define-function main
  0 even? @assert
  1 even? not @assert
  2 even? @assert
  3 even? not @assert
  4 even? @assert

  -0 even? @assert
  -1 even? not @assert
  -2 even? @assert
  -3 even? not @assert
  -4 even? @assert
@end
