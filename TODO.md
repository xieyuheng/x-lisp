# basic2

basic2 版本 basic-lisp ir 的设计在： diary/2026-06-25-redesign-basic-lisp.md
实现在 [meta-lisp.js] 的 basic2/ 中。

其中有些编译器生成的名字带有了 % 前缀，
我们需要避免用 % 前缀来代表编译器生成的名字。

我们应该用什么方案来处理编译器生成的名字？

我能想到的方案是：

方案 A：

- 对于返回 void 的 instr 而言，使用 ∅.<n> 其中 <n> 是数字，可以保证

方案 B：

- 所有有编译器生成的名字要带有 © 标记（我们可以假设用户所写的 symbol 中，不会用到这个标记作为名字）
  比如 匿名数据。

  也许这个只适合全局名字？

  function 局部，可以利用增加 .<n> 来保证唯一？

# 中文

https://chat.deepseek.com/a/chat/s/e6223b2a-d014-42c0-9281-e597b926967c

# self-hosting

[meta-lisp.meta] [review] env.meta
[meta-lisp.meta] [review] apply.meta
[meta-lisp.meta] [review] evaluate.meta

[meta-lisp.meta] 110-locate-pass.meta
[meta-lisp.meta] 120-check-pass.meta
[meta-lisp.meta] 130-shrink-pass.meta
[meta-lisp.meta] 140-uniquify-pass.meta
[meta-lisp.meta] 150-lift-lambda-pass.meta
[meta-lisp.meta] 160-unnest-operand-pass.meta
[meta-lisp.meta] 170-explicate-control-pass.meta
[meta-lisp.meta] 180-codegen-pass.meta

# compile to native
# socket api and network programming
# http library
# write agent in meta-lisp
