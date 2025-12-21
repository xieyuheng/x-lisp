@def main
  "abc" println
  "abc" "abc" @assert-equal
  "abc" "efg" @assert-not-equal
@end

main
