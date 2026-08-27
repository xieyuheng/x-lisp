---
title: tree and graph and data-oriented design
date: 2026-07-12
---

人们在设计新的系统编程语言（比如 jai）来解决 c/c++ 的问题时，
常常会考虑对 data-oriented design 的更好支持。

data-oriented design 非常适用于游戏编程，
因为经常可以按照内存中 entity 的排列顺序遍历所有 entity。

对于解释器和编译器编程而言，常用的是 tree。
tree 作为二维（三角形）数据没法被压缩在一维的同时，
还能保持相邻的节点在一维内存存储上相邻。
但是仍然可以按照最常用的遍历方式来保存 tree 的节点。

对于需要用到 graph 类数据的编程问题而言，
如果常用的遍历方式是按照 graph 中 node 的邻接顺序，
而不是按照任意 node 顺序来遍历，
data-oriented design 是完全没意义的。
如果经常要按照任意顺序来遍历 node（比如 rendering），
则 data-oriented design 是有意义的。

data-oriented design 的核心在于理解到对 data 的变换是编程的核心工作。
在解决不同问题时，要理解所用的 data 的属性与结构，
而不要盲目遵从某种设计方式。
