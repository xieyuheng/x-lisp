; x86.exe: multiple define-data with same struct type — independent values
;
; my-first.x = 10, my-second.x = 20
; define-code reads both, returns sum = 30

(define-struct cell-t
  (x int64-t))

(define-data my-first
  (struct cell-t
    (x 10)))

(define-data my-second
  (struct cell-t
    (x 20)))

(define-code main
  (mov (reg rax) (address my-first))
  (mov (reg rax) (mem (reg rax) (offset-of cell-t x)))
  (mov (reg rcx) (address my-second))
  (mov (reg rcx) (mem (reg rcx) (offset-of cell-t x)))
  (add (reg rax) (reg rcx))
  (ret))
