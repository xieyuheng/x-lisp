[cli.c] 下面给新的 passthrough api 写一个测试，放在 [cli.c] 现有的 calculator 例子程序中，
直接在命令行调用测试就可以。
增加一个 passthrough 命令，打印所有 passthrough 参数（一行）。


为了给 [meta-lisp.meta] 实现一个 cli library，
我们需要做一些准备工作。

首先需要在 [xvm.c] 和 [meta-builtin.meta] 中加入关于获取命令行参数的 builtin 函数。
应该如何设计 API？

你可以看 docs/ 中已有的 builtin 文档：

- [Builtin Functions](docs/en/reference/builtin/index.md) ([中文](docs/zh/reference/builtin/index.md))

你觉得在 process 一组，实现一个 `(current-command-line)` 函数如何？
请帮我多想一些方案来对比。

如果选择了 (current-command-line)，
是否使用 unix 传统的 -- xvm 参数和 (current-command-line) 所能获得的参数的分隔符？

设计两个 api 一个 (current-command-line) 拿到 -- 之后的参数 (list-t string-t)，
一个 api (名字未定) 拿到所有的参数 包括 -- 之前， -- 本身，和 -- 之后。





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
