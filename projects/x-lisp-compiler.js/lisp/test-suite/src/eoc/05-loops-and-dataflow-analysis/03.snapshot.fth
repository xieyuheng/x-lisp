@define-function main
  1 print newline 2 print newline 3 print newline 1 2 equal? 
  @if
    111 print newline 1 2 @tail-call equal? @else
    222 print newline 1 2 @tail-call equal? @then
  
@end


