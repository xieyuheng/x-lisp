; Semantic: read integer field from data section via (deref (address ...)) with sub-field path
;
; Encodings exercised:
;   mov reg, (deref (address ...)) — 8B /r with RIP-relative (mod=00 rm=101 + disp32)
;
; Data: define-struct → claim → define-data → (deref (address ...)) with path
;   (deref (address my-point x)) → RIP-relative MOV, offset = base + offsetof(point-t, x) = base + 0

(define-struct point-t
  (x int64-t)
  (y int64-t))

(claim my-point point-t)
(define-data my-point
  (struct
    (x 42)
    (y 100)))

(define-code read-point-x
  (block entry
    (mov (reg rax) (deref (address my-point x)))
    (ret)))
