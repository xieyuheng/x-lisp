[xvm.c] 和 [meta-builtin.meta] 中支持 (current-command-line) 和 (current-full-command-line)

现在准备工作做好了。
我们实现两个新的 builtin function：(current-command-line) 和 (current-full-command-line)
别忘了要同步修改：
- [xvm.c]
- [meta-builtin.meta]
- [docs] 关于 builtin 函数的 docs 和 index
  文档中要说明 unix 的 -- passthrough 惯例。

删除 cli_count_args 这个 api 也不要 passthrough_count 这个 api，因为需要的人可以拿到 array 之后自己数。

(current-full-command-line)
[meta-lisp.meta] term vs exp

[xvm.c] json parser
[meta-lisp.meta] json-t

[meta-lisp.meta] term-free-names.meta
[meta-lisp.meta] term-traverse.meta

[meta-lisp.meta] [review] exp-location.meta
[meta-lisp.meta] [review] exp-naive-subst.meta
[meta-lisp.meta] [review] exp-occurred-names.meta
[meta-lisp.meta] [review] exp-traverse.meta

[meta-lisp.meta] [review] stmt.meta
[meta-lisp.meta] [review] value.meta
[meta-lisp.meta] [review] type.meta
[meta-lisp.meta] [review] env.meta -- use (define-opaque-type)
[meta-lisp.meta] [refactor] parse-exp
