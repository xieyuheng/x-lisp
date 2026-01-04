@define-function main
  @if
    111 print newline 1 2 @tail-call equal? @else
    222 print newline 1 2 @tail-call equal? @then
  
@end


