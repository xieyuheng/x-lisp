---
title: define-object
date: 2025-10-08
---

# 现有用法

当 `define-data` 只有一个 sum type clause 时，
使用起来很不方便：

```scheme
(define-data block?
  (cons-block
   (info any?)
   (instrs (list? instr?))))
```

此时生成的数据带有 `#cons-block` hashtag。

并且生成下列名字：


```scheme
block?
cons-block
cons-block-info
cons-block-instrs
put-cons-block-info!
put-cons-block-instrs!
```

使用时经常要先做 alias：

```scheme
(define block-info cons-block-info)
(define block-instrs cons-block-instrs)
```

另外，之所以用 `cons-` 而不用 `make-` 做 data constructor 的前缀，
就是因为下面两个双动词开头的命名太奇怪了：

```scheme
put-make-block-info!
put-make-block-instrs!
```

# 新设计

可以考虑专门为这种情况设计一个 `define-object`：

```scheme
(define-object block?
  (make-block
   (info any?)
   (instrs (list? instr?))))
```

此时 data constructor 是 `make-block`，
但是生成 getter 和 putter 的依据不是 data constructor，
而是 data predicate 的名字。

也就是说生成下列名字：

```scheme
block?
make-block
block-info
block-instrs
put-block-info!
put-block-instrs!
```

生成的数据是带有 `#block` hashtag 的，
也是以 data predicate 的名字为依据，

# 影响

这可能会预示着，在未来 lisp 中的语法设计中，
新的定义类的语法关键词，
都会以这种生成很多名字到当前 module 的方式实现。

与之相对的是一个 `define-` 只定义的一个名字到当前 module 中，
而且这个名字就是 `define-` 后面所跟着的名字本身。

生成很多名字的缺点：

- 这些名字没有在代码文本中出现。

生成很多名字的优点：

- 可以避免很多新语法关键词的设计，
  直接 overload function application 语法。
