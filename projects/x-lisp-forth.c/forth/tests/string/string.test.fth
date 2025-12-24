@begin
  "" string? @assert
  "abc" string? @assert

  "" string-length 0 @assert-equal
  "abc" string-length 3 @assert-equal

  "abc" "abc" @assert-equal
  "abc" "def" @assert-not-equal

  "abc" "def" string-append "abcdef" @assert-equal
@end
