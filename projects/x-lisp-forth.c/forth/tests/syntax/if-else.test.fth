@def my-int-positive? ( x )
  x 0 int-greater? @if true @return @then
  false
@end

@def main
  2 my-int-positive? @assert
  1 my-int-positive? @assert
  0 my-int-positive? not @assert
  -1 my-int-positive? not @assert
  -2 my-int-positive? not @assert
@end
