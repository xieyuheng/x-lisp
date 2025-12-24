@begin
  'abc symbol? @assert
  'abc 'abc same? @assert
  'abc symbol-length 3 @assert-equal
  'abc symbol-to-string "abc" @assert-equal
  'abc 'def symbol-append 'abcdef @assert-equal
@end
