(import-all "../list/index.lisp")

(define (string-to-subscript string)
  (pipe string
    string-chars
    (list-map char-to-subscript)
    string-append-many))

(define (char-to-subscript char)
  (match char
    ("0" "₀")
    ("1" "₁")
    ("2" "₂")
    ("3" "₃")
    ("4" "₄")
    ("5" "₅")
    ("6" "₆")
    ("7" "₇")
    ("8" "₈")
    ("9" "₉")
    (_ char)))
