; Semantic: write to nested struct sub-field, read back to verify
;
;   (address my-rect bottom-right x)
;     → offset = base + offsetof(rect-t, bottom-right) + offsetof(point-t, x)
;     → offset = base + 16 + 0
;
; Encodings exercised:
;   lea reg, (address ...)         — 8D /r with RIP-relative  (load sub-field address)
;   mov [reg], imm                 — C7 /0                       (write to sub-field)
;   mov reg, (deref (address ...)) — 8B /r with RIP-relative  (read from sub-field)

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
    (bottom-right (struct (x 0) (y 0)))
    (color 0)))

(define-code test-write-nested
  (block entry
    (lea (reg rax) (address my-rect bottom-right x))
    (mov (reg-deref (reg rax)) (imm 99))
    (lea (reg rax) (address my-rect top-left y))
    (mov (reg-deref (reg rax)) (imm 77))
    (mov (reg rax) (deref (address my-rect bottom-right x)))
    (ret)))
