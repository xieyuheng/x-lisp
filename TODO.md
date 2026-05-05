[sexp.js] merge listHelpers.ts into Sexp.ts

- 处理相同数据类型的函数放在一起。
- 在 as* 函数中调用 is* 函数，而不是直接用 ===。
- merge 之后删除 listHelpers.ts

[sexp.js] improve error handling。

- 当 as* 函数出错的时候，只是 throw new Error(message)
  而是在 if 判断 sexp 带有 location 的时候，调用 throw new S.ErrorWithSourceLocation(message, ...)
  如果 sexp 不带 location，还是调用 throw new Error(message)。

[sexp.js] inline `Cons`
[sexp.js] extract `collectKeyValuePairs` -- from list of `Sexp`
[sexp.js] remove `listCollectKeyValuePairs`

[meta-builtin.meta] rename `located-sexp-t` to `sexp-t` -- like `exp-t` always have `location`
[stack-lisp.c] rename `parse-located-sexps` `parse-sexps` -- always have `location`
[meta-builtin.meta] `sexp-collect-key-value-pairs`

[meta-lisp.meta] `parse-project-config`
[meta-lisp.meta] `load-project-config`
[meta-lisp.meta] `load-project`
[meta-lisp.meta] `check-pipeline`
[meta-lisp.meta] `mod-t` -- complete
[meta-lisp.meta] `definition-t` -- fix type of `(fn (-> (list-t value-t) value-t))`
[meta-lisp.meta] `evaluate` -- handle type
[meta-lisp.meta] `evaluate` -- fix error report -- maybe need `buffer-t`
