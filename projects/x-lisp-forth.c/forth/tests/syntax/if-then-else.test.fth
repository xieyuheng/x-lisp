@def my-int-positive? ( x )
  x 0 int-greater? @if
    true
  @else
    false
  @then
@end

@def main
  2 my-int-positive? @assert
  1 my-int-positive? @assert
  0 my-int-positive? not @assert
  -1 my-int-positive? not @assert
  -2 my-int-positive? not @assert
@end
