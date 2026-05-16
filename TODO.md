[meta-lisp.meta] 继续迁移 [meta-lisp.js] -- 完成语法解析

之前在把 [meta-lisp.js] 迁移到 [meta-lisp.meta]，
但是，经过了新的语法设计之后 [meta-lisp.js] 的语法更新的，
而 [meta-lisp.meta] 的语法还是旧的。

现在把 [meta-lisp.meta] 中的 exp value type 等等定义，
更新为与 [meta-lisp.js] 同步。
并且完成新的语法解析。

注意，在修改之后，为了检查修改的正确性，你需要：

- 调用 sh scripts/check.sh 做类型检查。
- 调用 sh scripts/test.sh 做测试。
- 调用 sh scripts/self-check.sh 用 self-hosting 编译器做类型检查。

[meta-lisp.meta] `expand-pass`
[meta-lisp.meta] `mod-t` -- complete
[meta-lisp.meta] `definition-t` -- fix type of `(fn (-> (list-t value-t) value-t))`
[meta-lisp.meta] fix error report -- maybe need `buffer-t`
