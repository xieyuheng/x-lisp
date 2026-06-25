; x86.exe: multiple define-data with same struct type — independent values
;
; my-first.x = 10, my-second.x = 20
; define-code reads both, returns sum = 30

(define-struct cell-t
  (x int64-t))

(claim my-first cell-t)
(define-data my-first
  (struct
    (x 10)))

(claim my-second cell-t)
(define-data my-second
  (struct
    (x 20)))

(define-code sum-two-cells
  (block entry
    (mov (reg rax) (address my-first))
    (mov (reg rax) (reg-deref (reg rax) (offset-of cell-t x)))
    (mov (reg rcx) (address my-second))
    (mov (reg rcx) (reg-deref (reg rcx) (offset-of cell-t x)))
    (add (reg rax) (reg rcx))
    (ret)))
