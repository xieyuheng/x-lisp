; x86.exe: data-section pointer to a named label via (address ...)
;
; origin     = point-t{ x=11, y=22 }
; origin-ptr = pointer-t whose value is (address origin) = &origin
;
; The (address origin) value in a data slot emits an 8-byte pointer plus a
; deferred internal relocation resolving to the `origin` label.
;
; define-code: load *origin-ptr (= &origin), then mem to read origin.x = 11

(define-struct point-t
  (x int64-t)
  (y int64-t))

(define-data origin
  (struct point-t
    (x 11)
    (y 22)))

(define-data origin-ptr (address origin))

(define-code main
  (mov (reg rax) (mem (address origin-ptr)))   ;; rax = *origin-ptr = &origin
  (mov (reg rax) (mem (reg rax)))           ;; rax = origin.x = 11
  (ret))
