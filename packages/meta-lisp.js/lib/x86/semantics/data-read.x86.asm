; Semantic: read integer field from data section via label-deref with sub-field path
;
; Encodings exercised:
;   mov reg, label-deref — 8B /r with RIP-relative (mod=00 rm=101 + disp32)
;
; Data: define-struct → claim → define-data → label-deref with path
;   (label-deref (label my-point x)) → RIP-relative MOV, offset = base + offsetof(point-t, x) = base + 0

(define-struct point-t
  (x int64-t)
  (y int64-t))

(claim my-point point-t)
(define-data my-point
  (x 42)
  (y 100))

(define-code read-point-x
  (block entry
    (mov (reg rax) (label-deref (label my-point x)))
    (ret)))
