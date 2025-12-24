@begin
  "" string? @assert
  "abc" string? @assert

  "abc" "abc" @assert-equal
  "abc" "efg" @assert-not-equal
@end
