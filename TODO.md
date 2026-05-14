# local (define)

[meta-lisp.js] fix missing case of 007.3-ModuleImportPass.ts

---

[plan] 007.3-ModuleImportPass.ts 有 bug，它只处理了 `Let1`，
也就是只处理了 DesugarPass 之后的情况。

我在考虑 010-DesugarPass.ts 可否放在 007-ModulePass 之前。
但是 010-DesugarPass.ts 在调用  M.simplifyMatch 时，依赖了 `mod`。

你帮我看一下 M.simplifyMatch 是否可以不依赖 `mod`。

---

[meta-lisp.js] support using `(define)` in function body -- use lambda lift

- support recursive and mutual recursive function

# setup feedback loop

[meta-lisp.meta] remove `env` `evaluate` and `value`
[meta-lisp.meta] `expand-pass`
[meta-lisp.meta] `mod-t` -- complete
[meta-lisp.meta] `definition-t` -- fix type of `(fn (-> (list-t value-t) value-t))`
[meta-lisp.meta] fix error report -- maybe need `buffer-t`
