(define-data (list-t A)
  [list-null () (list-t A)]
  [list-cons ([head A] [tail (list-t A)]) (list-t A)])

;; var

(define-data exp-t
  [exp-var ([name string-t]) exp-t]
  [exp-int ([value int-t]) exp-t]
  [exp-prim ([op string-t] [args (list-t exp-t)]) exp-t]
  [exp-let ([name string-t] [rhs exp-t] [body exp-t]) exp-t])

(define-data program-t
  [program-new ([info info-t] [body exp-t]) program-t])

;; c-var

;; maybe we need structural typing,
;; instead of nominal typing.

;; 也许就应该用 nominal typing，
;; 即用不同名字的数据构造子，
;; 因为这些数据构造子的意义不是独立的，
;; 而是来自它们与同类型的其他构造子之间的关系的。

;; 缺点是结构相似但是名字不同的数据之间，需要显式地转换。

;; 定义数据构造子不是让人通过 substitution 来使用所定义的名字，
;; 而是说所定义的名字可以如何使用以构造数据。

(define-data atom-t
  [atom-var ([name string-t]) atom-t]
  [atom-int ([value int-t]) atom-t])

(define-data c-exp-t
  [c-exp-atom ([atom atom-t]) c-exp-t]
  [c-exp-prim ([op string-t] [args (list-t atom-t)]) c-exp-t])

(define-data stmt-t
  ;; lhs should only be var for now, but can not express this.
  [stmt-assign ([lhs c-exp-t] [rhs c-exp-t]) stmt-t])

(define-data tail-t
  [tail-return ([exp c-exp-t]) tail-t]
  [tail-seq ([stmt stmt-t] [tail tail-t]) tail-t])

(define-data c-program-t
  [c-cprogram-new ([info info-t] [tails (list-t tail-t)]) c-program-t])
