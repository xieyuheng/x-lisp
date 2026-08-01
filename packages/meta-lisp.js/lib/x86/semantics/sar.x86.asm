; Semantic: arithmetic right shift preserves sign
;
; Test 1: -42 >> 3 = -6  (sign bit preserved by arithmetic shift)
; Test 2:  42 >> 3 =  5  (positive values also work)

(define-code main
  entry
  (mov (reg rax) -42)
  (sar (reg rax) 3)
  (ret))
