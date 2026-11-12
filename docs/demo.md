> 自上而下
> 从整体到局部
> 从简单到复杂

# 包、模块、文件

package -> module -> file (fragment)

- meta-package.json 用来声明一个「包」（package）
  - 为未来的包管理做准备

- 一个 package 内可以包含多个「模块」（module）

- 一个模块由多个文件内有多个函数定义和类型定义

  - 一个模块的代码片段可以分散到多个 .meta 或 .md 文件
    - 模块系统与文件系统解耦

# 编译器

- meta-lisp.ts check

  - 以 [meta-math.meta] fibonacci 为例

  - 可以推导任何函数的类型

    - 包括递归函数，比如 fibonacci
    - 包括互递归函数，比如 is-even is-odd

  - markdown 内的报错
    - 以 [meta-example.meta] stepwise 为例
    - 可以直接运行 markdown 代码
    - 在 markdown 内给出精确的报错位置信息

- meta-lisp.ts build

  - 以 [meta-example.meta] 为例
  - 编译结果
    - 类 llvm 中间语言
    - xvm 汇编语言

# 虚拟机

- xvm test
  - 以 [meta-example.meta] 为例
  - (define-test) 内置的测试框架
- xvm run
  - 以 [meta-example.meta] 为例
  - 运行 meta-package.json 中所声明的 entry 函数

# 极简语法

- 极简的语法设计

  - 一个简短的语法文档，
    容纳所有所有语法关键词

# 类型系统

- 极简的类型系统

  - 代数数据类型（函数式编程的核心）
  - 印出自举编译器的核心数据类型
    - type-t 类型
    - stmt-t 顶层语句
    - exp-t 表面语法表达式
    - term-t 消除语法糖的核心语法表达式

# 编译器代码

- nanopass 架构

  - 介绍 typescript 实现的 bootstrap 编译器

- 自举编译器的进度
  - [meta-pass-dump.meta] 自举编译器的测试
  - 为什么需要「文学式编程」

# 内置函数

- 英文内置函数
- 中文内置函数
  - 以内置函数中的「列表排序」为例子，
    做一个让 AI 用「文学式编程」的方式来解释代码的实验

# AI 把普通程序转化为「逐步精细」的例子

```
我们在 [meta-example.meta] 中，
有一个 stepwise 的例子，
是基于 markdown 和「逐步精细」的文学式编程。

现在 [meta-builtin.meta] 中，有一个 数组排序.meta 代码，
这个是用 meta-lisp 的中文版本「元语」实现的快速排序算法，
把这个 数组排序.meta 改为 数组排序.md，
参考 stepwise 的逐步精细和文学式编程。
```

# 尾声

介绍「开发历程」与「开发日志」
