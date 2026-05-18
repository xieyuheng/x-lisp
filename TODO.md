[meta-lisp.js] 不要再 unify 中调用 substDeepWalk，而是修改 varOccurredInType，

模仿 minikanren 的 occurs-check。

;; occurs-check : Var * Term * Subst -> Bool
(define (occurs-check x v s)
  (let ((v (walk v s)))
    (cond ((var? v) (eq? v x))
          ((pair? v) (or (occurs-check x (car v) s)
                         (occurs-check x (cdr v) s)))
          (else #f))))

给 varOccurredInType 增加一个 subst 参数（放在开头）。

varOccurredInType 的名字，文件的名字和辅助函数的名字，都改成 occurCheck

[meta-lisp.meta] 迁移 [meta-lisp.js] 的 020-DesugarPass.ts 到 [meta-lisp.meta] 的 desugar-pass
