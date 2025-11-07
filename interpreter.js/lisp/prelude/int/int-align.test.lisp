(import-all "int-align")

(assert-equal 0 (int-align 16 0))
(assert-equal 16 (int-align 16 8))
(assert-equal 16 (int-align 16 16))
(assert-equal 32 (int-align 16 24))
