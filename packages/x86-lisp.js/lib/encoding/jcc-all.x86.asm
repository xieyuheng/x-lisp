; Conditional jump encodings — all condition codes
;
; 0F 8x rel32 — Jcc near (4-byte displacement)
;
; Intel condition codes:
;   84 e(z)   85 ne(nz)
;   8C l(nge) 8E le(ng)  8F g(nle) 8D ge(nl)
;   82 b(c)   86 be(na)  87 a(nbe) 83 ae(nb)
;   88 s       89 ns

(define-code main
  (j (cc e) (label target))
  target
  (ret))

(define-code jcc-ne
  (j (cc ne) (label target))
  target
  (ret))

(define-code jcc-l
  (j (cc l) (label target))
  target
  (ret))

(define-code jcc-le
  (j (cc le) (label target))
  target
  (ret))

(define-code jcc-g
  (j (cc g) (label target))
  target
  (ret))

(define-code jcc-ge
  (j (cc ge) (label target))
  target
  (ret))

(define-code jcc-b
  (j (cc b) (label target))
  target
  (ret))

(define-code jcc-be
  (j (cc be) (label target))
  target
  (ret))

(define-code jcc-a
  (j (cc a) (label target))
  target
  (ret))

(define-code jcc-ae
  (j (cc ae) (label target))
  target
  (ret))

(define-code jcc-s
  (j (cc s) (label target))
  target
  (ret))

(define-code jcc-ns
  (j (cc ns) (label target))
  target
  (ret))
