;; test: (@array ...) literal as struct field value
;; path: (@array 10 20 30 40 50) → parseExp → ArrayExp
;;       → evaluate → ArrayValue([IntValue(10), ..., IntValue(50)])
;;       → layout: inline write 5 × uint8_t elements
;;       → read first byte via address + deref

(define-struct buffer-t
  (data (array-t uint8-t 5)))

(define-data buf
  (struct buffer-t
    (data (array 10 20 30 40 50))))

(define-code test-array
  (block entry
    (mov (reg rax) (address buf))
    (mov (reg rax) (reg-deref (reg rax)))
    (and (reg rax) (imm 255))
    (ret)))
