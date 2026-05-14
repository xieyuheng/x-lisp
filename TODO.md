# local (define)

[meta-lisp.js] refactor `createFreshVar`

---

[plan] 下面考虑 `createFreshVar`

目前 `createFreshVar` 生成全局新名字的方式是相对一个全局记录，来增加 `.n` 后缀。
这样实现不安全。
因为全局记录只是调用 `createFreshVar` 时，记录下来的参数 name。

现在两个地方用到了 `createFreshVar`。
都应该改为：

- 在当时的具体情况下，找到合适的 `usedNames`，
- 然后调用 `generateRelativeFreshName`，然后构造 `Var`（需要 `location` 参数）。

你觉得应该如何修改？

---

[meta-lisp.js] `expSubst`

我计划实现 `expSubst` 可以把一个表达式中的变量代替为另一个表达式，
应该如何设计？

注意：

- 需要正确处理 lambda。


[meta-lisp.js] support using `(define)` in function body -- use lambda lift

- support recursive and mutual recursive function

# setup feedback loop

[meta-lisp.meta] remove `env` `evaluate` and `value`
[meta-lisp.meta] `expand-pass`
[meta-lisp.meta] `mod-t` -- complete
[meta-lisp.meta] `definition-t` -- fix type of `(fn (-> (list-t value-t) value-t))`
[meta-lisp.meta] fix error report -- maybe need `buffer-t`
