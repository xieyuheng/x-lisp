[meta-lisp.js] 还有哪些辅助性的数据类型没有分属 Exp 和 Term，但是没有 Exp 和 Term 前缀的？

[meta-lisp.js] 调查一下，有哪些文件原本可以直接 import * as M from "../index.ts"
但是还是单独 import 了某些函数或类型？
或者已经有了 import * as M from "../index.ts"
但是还是单独 import 了某些函数或类型？
我需要把它们都改成 `import * as M` 的形式，
以避免有多余的 import。
引用的时候用 M.<name> 就可以了。

[meta-lisp.meta] [review] exp-free-names.meta
[meta-lisp.meta] [review] exp-location.meta
[meta-lisp.meta] [review] exp-naive-subst.meta
[meta-lisp.meta] [review] exp-occurred-names.meta
[meta-lisp.meta] [review] exp-traverse.meta

[meta-lisp.meta] [review] stmt.meta
[meta-lisp.meta] [review] value.meta
[meta-lisp.meta] [review] type.meta
[meta-lisp.meta] [review] env.meta -- use (define-opaque-type)
[meta-lisp.meta] [refactor] parse-exp
