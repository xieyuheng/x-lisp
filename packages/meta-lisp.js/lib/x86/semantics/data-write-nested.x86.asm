; Semantic: write to nested struct sub-field, read back to verify
;
;   offset-of(rect-t bottom-right x)
;     → offsetof(rect-t, bottom-right) + offsetof(point-t, x) = 16 + 0 = 16
;   offset-of(rect-t top-left y)
;     → offsetof(rect-t, top-left) + offsetof(point-t, y) = 0 + 8 = 8
;
; Encodings exercised:
;   mov reg, (address ...)                       — RIP-relative LEA-style load of label addr
;   mov [reg + offset-of(...)], imm              — C7 /0 with disp   (write to sub-field)
;   mov reg, (deref reg (offset-of ...))     — 8B /r with disp   (read from sub-field)

(define-struct point-t
  (x int64-t)
  (y int64-t))

(define-struct rect-t
  (top-left point-t)
  (bottom-right point-t)
  (color int64-t))

(define-data my-rect
  (struct rect-t
    (top-left (struct point-t (x 0) (y 0)))
    (bottom-right (struct point-t (x 0) (y 0)))
    (color 0)))

(define-code main
  entry
  (mov (reg rax) (address my-rect))
  (mov (deref qword (reg rax) (offset-of rect-t bottom-right x)) 99)
  (mov (deref qword (reg rax) (offset-of rect-t top-left y)) 77)
  (mov (reg rax) (deref (reg rax) (offset-of rect-t bottom-right x)))
  (ret))
