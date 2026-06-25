; Semantic: read field from nested struct via (deref (address ...)) with multi-step path
;
;   (deref (address my-rect bottom-right x))
;     → RIP-relative MOV
;     → offset = base + offsetof(rect-t, bottom-right) + offsetof(point-t, x)
;     → offset = base + 16 + 0 = base + 16
;
; Encodings exercised:
;   mov reg, (deref (address ...)) — 8B /r with RIP-relative
;
; Data: nested struct — rect-t embeds two point-t structs

(define-struct point-t
  (x int64-t)
  (y int64-t))

(define-struct rect-t
  (top-left point-t)
  (bottom-right point-t)
  (color int64-t))

(claim my-rect rect-t)
(define-data my-rect
  (struct
    (top-left (struct (x 0) (y 0)))
    (bottom-right (struct (x 100) (y 200)))
    (color 255)))

(define-code read-rect
  (block entry
    (mov (reg rax) (deref (address my-rect bottom-right x)))
    (ret)))
