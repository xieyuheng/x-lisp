@define-function main
  1
  print
  @drop
  newline
  @drop
  2
  print
  @drop
  newline
  @drop
  3
  print
  @drop
  newline
  @drop
  1
  2
  equal?
  @if
    111 print @drop newline @drop 1 2 @tail-call equal?
  @else
    222 print @drop newline @drop 1 2 @tail-call equal?
  @then
@end

