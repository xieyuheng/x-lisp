; Conditional jump encodings — all condition codes
;
; 0F 8x rel32 — Jcc near (4-byte displacement)
;
; Intel condition codes:
;   84 e(z)   85 ne(nz)
;   8C l(nge) 8E le(ng)  8F g(nle) 8D ge(nl)
;   82 b(c)   86 be(na)  87 a(nbe) 83 ae(nb)
;   88 s       89 ns

(define-code jcc-e
  (block entry (j (cc e) (label target)))
  (block target (ret)))

(define-code jcc-ne
  (block entry (j (cc ne) (label target)))
  (block target (ret)))

(define-code jcc-l
  (block entry (j (cc l) (label target)))
  (block target (ret)))

(define-code jcc-le
  (block entry (j (cc le) (label target)))
  (block target (ret)))

(define-code jcc-g
  (block entry (j (cc g) (label target)))
  (block target (ret)))

(define-code jcc-ge
  (block entry (j (cc ge) (label target)))
  (block target (ret)))

(define-code jcc-b
  (block entry (j (cc b) (label target)))
  (block target (ret)))

(define-code jcc-be
  (block entry (j (cc be) (label target)))
  (block target (ret)))

(define-code jcc-a
  (block entry (j (cc a) (label target)))
  (block target (ret)))

(define-code jcc-ae
  (block entry (j (cc ae) (label target)))
  (block target (ret)))

(define-code jcc-s
  (block entry (j (cc s) (label target)))
  (block target (ret)))

(define-code jcc-ns
  (block entry (j (cc ns) (label target)))
  (block target (ret)))
