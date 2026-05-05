[sexp.js] inline sexp getter functions

- 在 sexpGetters.ts 中有如下简单的 getter functions：

  export function symbolContent(sexp: S.Sexp)
  export function keywordContent(sexp: S.Sexp)
  export function stringContent(sexp: S.Sexp)
  export function intContent(sexp: S.Sexp)
  export function floatContent(sexp: S.Sexp)
  export function listElements(sexp: S.Sexp)

- 在调用这些函数的地方 inline 这些函数。

- 注意，不只是在 [sexp.js] 项目中有对这些函数的调用，
  projects/ 的其他 *.js 项目中也可能有对这些函数的调用，
  都要 inline。

  - 修改之后你可以在项目根目录，
    运行 scripts/all.sh 脚本来做完整测试。

- inline 之后删除这些简单的 getter 函数（保留 sexpGetters 文件），
  因为其中还有 `listCollectKeyValuePairs`。

[sexp.js] [refactor] extract `collectKeyValuePairs` from `listCollectKeyValuePairs`

- `collectKeyValuePairs` 以 `sexps: Array<S.Sexp>` 为参数

[sexp.js] [refactor] inline and remove `listCollectKeyValuePairs`

- 在调用 `listCollectKeyValuePairs` 的地方 inline `listCollectKeyValuePairs`

[sexp.js] [refactor] merge sexpGetters.ts into Sexp.ts

- 处理相关类型的函数放在一起。
- merge 之后删除 sexpGetters.ts。

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
