@def main
  make-set ( set )
  set any-set? @assert
  set set-copy set equal? @assert
  set set-size 0 equal? @assert
  set set-empty? @assert

  1 set set-add! @drop
  2 set set-add! @drop
  3 set set-add! @drop
  set set-size 3 equal? @assert

  1 set set-add! @drop
  2 set set-add! @drop
  3 set set-add! @drop
  set set-size 3 equal? @assert

  1 set set-delete! @drop
  2 set set-delete! @drop
  3 set set-delete! @drop
  set set-size 0 equal? @assert

  1 set set-add! @drop
  2 set set-add! @drop
  3 set set-add! @drop
  set set-size 3 equal? @assert

  set set-clear! @drop
  set set-size 0 equal? @assert
@end
