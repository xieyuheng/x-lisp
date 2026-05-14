---
title: can not view symbol as string
date: 2025-07-31
---

可以想象一种简化整个语言的方式是把 symbol 当作 string。

但是我发现不能这样做。

因为这样做就需要我们把 `"abc"` 理解为 `'abc`，
此时 `'abc` 可以被 parser 展开成 `(quote abc)`，
尽管 `"abc"` 也可以被 parser 展开成 `(quote abc)`，
但是 `"a b c"` 没法被 parser 展开成任何东西，
比如简单展开成 `(quote "a b c")` 是不对的。

# 再次尝试合并 symbol 和 string

[2025-09-23]

如果区分 symbol 和 string 这两种 sexp value，
就可以让 symbol 代表 identifier，
让 string 代表 literal string。

如果不区分 symbol 和 string，
我们还是想让写作 symbol 的 string 代表 identifier，
让 string 代表 literal string。

写作 symbol 的 string 作为 identifier 的实现方式是：

- 直接出现的 symbol 代表 identifier。
- 带有 quote 的 symbol `'abc` 翻译成 `(@quote abc)`，
  在 evaluate 时被求值成 string。。

string 代表 literal string 的实现方式是：

- 把 `"hello world"` 翻译成 `(@quote "hello world")`，
  在 evaluate 时被求值成 string。
- 包含空格的 string 不能作为 identifier。

打印 string 的时候：

- 如果 string 是 valid symbol，
  就直接打印成单引号的 literal symbol。

- 如果 string 不是 valid symbol，
  比如代表 literal atom 或带有空格，
  就打印成双引号的 literal string。

还是可以有 symbol 这个概念，
但是此时它只是代表不包含空字符的 string。

但是感觉这样还是不行，
因为这将导致 literal string 不再是 self-quoted value。

symbol 不是 self-quoted value：

```scheme
'(a) => ['a]
```

int 和 float 是 self-quoted value：

```scheme
'(1) => [1]
```

如果想要 string 也是 self-quoted value，
就必须有:

```scheme
'("a") => ["a"]
```

但是按照上面的实现方式有：

```scheme
'("a") => ['"a"]
```

注意，如果不给 x-sexp 加上 `#t #f` 这种 literal bool 语法，
那么 `#t #f` 也不是 self-quoted valued：

```scheme
'(#t) => ['#t]
```

这好像是没法避免的，
因为如果 x-sexp 和 x-lisp 被作为两个 project 的话，
就没法在 x-sexp 中以 self-quoted literal 的形式，
支持 x-lisp 中想要支持的所有 literal。
比如 `#null` 和 `#void`。

除非合并 x-sexp 和 x-lisp。

# 另外一种方案

[2025-09-23]

还能想到一种方案是区分 `'(abc)` 与 `'abc`：

```scheme
'(abc) =parse=> (@quote (abc))
'abc => "abc"
```

这将导致 `"hello world"` 可以被用作 identifier，
也就是可以被当作函数名。

double qouted string 是 self-quoted value：

```scheme
'("a") => ['a]
```

single qouted string 也是 self-quoted value：

```scheme
'('a) => ['a]
```

这也是不行的，
因为一旦 double qouted string 可以被当作 identifier，
它就没法被当作 string literal 了。

不论如何，融合 symbol 和 string 的设计都太难解释了。
所以还是放弃了。
