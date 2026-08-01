; Semantic: read field from nested struct via (address ...) + offset-of
;
;   (mov rax (address my-rect))
;   (mov rax (deref rax (offset-of rect-t bottom-right x)))
;     → offset-of(rect-t bottom-right x)
;     → offsetof(rect-t, bottom-right) + offsetof(point-t, x) = 16 + 0 = 16
;
; Encodings exercised:
;   mov reg, (address ...)            — RIP-relative LEA-style load of label addr
;   mov reg, (deref reg offset)   — 8B /r with disp from offset-of
;
; Data: nested struct — rect-t embeds two point-t structs

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
    (bottom-right (struct point-t (x 100) (y 200)))
    (color 255)))

(define-code main
  entry
  (mov (reg rax) (address my-rect))
  (mov (reg rax) (deref (reg rax) (offset-of rect-t bottom-right x)))
  (ret))
