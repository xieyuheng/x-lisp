---

尝试在 stack-lisp.c 的基础设施（value 编码，还有 gc）的基础上，
设计编译到 native x86-64 的方案。

把设计的文档保存在 docs/zh/diary/，
模仿已有的 diary 文件的格式，作者署名你自己（你的名字是 opencode/deepseek-v4-pro）。

难点：

- gc root 发现问题。
- gc safepoint 设计问题。

要求：

- 必须是 precise GC。
- 不能采用编译到 C 这种捷径（未来会遇到很多问题）。

我的感觉：

- 感觉 shadow stack 的开销过大，每次函数调用，用到的每个变量都要受到惩罚。
  - primitive 不能回调 meta-lisp，限制了 meta-lisp 像是 lua 一样，作为嵌入别的 c 项目的脚本语言的能力。
- 需要你寻找更好的方案，并且分析实现过程中的难点。

---


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
