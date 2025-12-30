@def snapshot ( lhs rhs )
  lhs print @drop
  " <=> " write @drop
  rhs print @drop
  " = " write @drop
  lhs rhs total-compare println @drop
@end

@def main
  1 1 snapshot
  1 2 snapshot
  2 1 snapshot
  1 1.0 snapshot
  "abc" "abc" snapshot
  "abc" "def" snapshot
  -- 'abc "abc" snapshot
@end
