;; test: (address name) syntax in define-data
;; path: (address cell) → parseExp → AddressExp
;;       → evaluate → AddressValue("cell")
;;       → layout: write 8-byte placeholder + DataAddressFixup to cell
;;       → read via (mem (address ptr)) → load address → mem

(define-struct int-cell-t
  (value int64-t))

(define-data cell
  (struct int-cell-t (value 99)))

(define-data ptr
  (address cell))

(define-code main
  (mov (reg rax) (mem (address ptr)))
  (mov (reg rax) (mem (reg rax)))
  (ret))
