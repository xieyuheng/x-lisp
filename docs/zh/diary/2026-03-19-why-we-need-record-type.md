---
title: why we need record type?
date: 2026-03-19
---

可以发现，如果可以不支持 structural record type，
也就是不支持 interface type，
就可以完全不实现 subtype 关系。

这样语言可以简化很多，
完全可以用只有一个 data constructor 的 datatype，
来代替 interface。

比如：

```scheme
(define-interface (digraph-t V)
  :vertex-set (set-t V)
  :direct-successor-hash (hash-t V (set-t V))
  :direct-predecessor-hash (hash-t V (set-t V)))
```

可以被代替为：

```scheme
(define-datatype (digraph-t V)
  (cons-digraph
   (vertex-set (set-t V))
   (direct-successor-hash (hash-t V (set-t V)))
   (direct-predecessor-hash (hash-t V (set-t V)))))
```

# accessor 名字的问题

`define-datatype` 可以生成很多 accessor 函数，
但是名字不太好：

```scheme
cons-digraph-vertex-set
cons-digraph-direct-successor-hash
cons-digraph-direct-predecessor-hash
```

为了生成更好的 accessor 函数名字，
假设有语法关键词 `define-single-datatype`：

```scheme
(define-single-datatype (digraph-t V)
  (vertex-set (set-t V))
  (direct-successor-hash (hash-t V (set-t V)))
  (direct-predecessor-hash (hash-t V (set-t V))))
```

可以根据类型的名字 `digraph-t`，生成 accessor 名：

```scheme
digraph-vertex-set
digraph-direct-successor-hash
digraph-direct-predecessor-hash
```

# constructor 参数顺序的问题

如果不用 record type，
data constructor 会依赖于参数顺序，
这使得处理比较大的 record type 时，
用 datatype 来代替变得不切实际。

在这个思路下的解决方案之一是，支持 named arguments。

# datatype 之间的 subtype

在用 datatype 定义语言的语法解析树时，
如果 datatype 之间的 subtype 关系，
对应于语言之间的包含关系。

可以临时用一个语言的 evaluate 处理子语言的 expression。

所以有些不想放弃 subtype。
