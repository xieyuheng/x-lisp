; Semantic: read integer field from data section via (address ...) + offset-of
;
; Encodings exercised:
;   mov reg, (address ...)            — RIP-relative LEA-style load of label addr
;   mov reg, (reg-deref reg offset)   — 8B /r with disp from offset-of
;
; Data: define-struct → claim → define-data → (address ...) + offset-of
;   offset-of(point-t x) = 0

(define-struct point-t
  (x int64-t)
  (y int64-t))

(define-data my-point
  (struct point-t
    (x 42)
    (y 100)))

(define-code read-point-x
  (block entry
    (mov (reg rax) (address my-point))
    (mov (reg rax) (reg-deref (reg rax) (offset-of point-t x)))
    (ret)))
