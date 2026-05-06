---
title: package manager
date: 2026-05-06
---

project as package。

project.json 或 project.sexp 可以像 package.json 一样，
描述可以被别的 project 所依赖的 package。

方案 A：

- qualified variable 只有两层名字 `<mod-name>/<name>`。

- 编译一个 project 时，先计算出整个 project 的 content hash，
  作为 `<mod-name>` 的前缀。

- 这样每个 project 中的每个 module 就有唯一的 name 了。
