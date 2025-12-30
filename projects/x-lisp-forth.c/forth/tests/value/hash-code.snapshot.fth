@def echo-hash-code [value]
  value print " -> " write value hash-code println
@end

@def main
  1 echo-hash-code
  1.0 echo-hash-code
  "" echo-hash-code
  "abc" echo-hash-code
@end