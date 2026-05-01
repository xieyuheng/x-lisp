---
title: pass and pipeline
date: 2026-05-01
---

除了独立的 pass 之外，还应该有 pipeline 的概念，
一个 pipeline 是多个 pass 的组合。

pass 可翻译为「道次」。

pass 根据功能分类：

- 分析型（analysis）：积累数据。
- 转化型（transform）：利用积累的数据来做修改。

pass 根据范围：

- 函数级（定义级）：比如类型检查。
- 模块级：比如类型错误模块的 snapshot testing。
- 项目级：比如 bundle。

实现 pass 的方式：

- 方案 A：所有 pass 都带有 project 参数，在对 project 做副作用。
  不同等级和类型的 pass 通过代码本身来区分，不做额外的抽象与限制。

  缺点：

  - 分析型 pass 所生成的数据，不适合都放到 project 中。
  - 编译到 basic-lisp 和 stack-lisp 这种产出型的 pass，
    也不适合把产出结果放到 project 中。

- 方案 B：类似方案 A，但是让 pass 可以带有任意参数，
  而不是统一带有一个 project 参数。
  在副作用之外可以有返回值。
