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

  1 set-12 set-member? @assert
  2 set-12 set-member? @assert
  3 set-12 set-member? not @assert

  set-1
  set-2 set-union
  set-3 set-union
  set-123 @assert-equal

  set-12
  set-23 set-inter
  set-2 @assert-equal
@end

@def set-1
  make-set ( set )
  1 set set-add! @drop
  set
@end

@def set-2
  make-set ( set )
  2 set set-add! @drop
  set
@end

@def set-3
  make-set ( set )
  3 set set-add! @drop
  set
@end

@def set-12
  make-set ( set )
  1 set set-add! @drop
  2 set set-add! @drop
  set
@end

@def set-23
  make-set ( set )
  2 set set-add! @drop
  3 set set-add! @drop
  set
@end

@def set-31
  make-set ( set )
  3 set set-add! @drop
  1 set set-add! @drop
  set
@end

@def set-123
  make-set ( set )
  1 set set-add! @drop
  2 set set-add! @drop
  3 set set-add! @drop
  set
@end
