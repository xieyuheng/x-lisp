;; test: (address name) syntax in define-data
;; path: (address cell) → parseExp → AddressExp
;;       → evaluate → AddressValue("cell")
;;       → layout: write 8-byte placeholder + DataAddressReloc to cell
;;       → read via (deref (address ptr)) → load address → deref

(define-struct int-cell-t
  (value int64-t))

(define-data cell
  (struct int-cell-t (value 99)))

(define-data ptr
  (address cell))

(define-code main
  (mov (reg rax) (deref (address ptr)))
  (mov (reg rax) (deref (reg rax)))
  (ret))
