@def main
  make-set ( set )
  set any-set? @assert
  set set-copy set equal? @assert  
  set set-size 0 equal? @assert
  set set-empty? @assert
@end