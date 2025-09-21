---
title: why tael and how set
date: 2025-09-16
---

# 动机

在想要增加 set 的 literal 语法时，
我对 tael 的设计产生的动摇，
现在重新回顾一下 tael 的设计起源。

（1）tael 是 list with attribute。
这一点的「合理性」来源于 XML 的 element + attribute 语义。
也就是说 tael 是可以看作是 XML 的扩展，其中 tag 可以是任意 node。

（2）tael 的语法处理的「合理性」来源于对 quote 的类比：

- `'symbol` 被解析为 `(quote symbol)`
- `[a b c]` 被解析为 `(tael a b c)`

（3）tael 的用处之一是给语法关键词加可选部分，比如 `(class)` 的 `:inherit`。

（4）tael 的用处之二是将 attribute 作为 meta data 来保存 parse 时候的 span，
但是这种设计证明是错误的，这样做是行不通的。

- 比如 `[:x 1 :y 2]` 不能被 read 成 `[:x 1 :y 2 :span ...]`，
  因为 tael 可能本身就带有 `:span` 这个 attribute，
  比如 `[:x 1 :y 2 :span [1 2]]`。

- 想要实现 meta data，一个可行的方案是模仿 clojure，给 value 都加上 meta，
  可以用 `(with-meta)` 来构造带有 meta 的 value，
  并且用 `(get-data)` 取出来 value 的 meta。

（5）tael 的设计灵感直接来自与之对应的 structural type 表达式 tau。
如果 tael 要被分离为两种数据 list 和 record，
那么 tau 也要被分离为两种类型表达式。

# 问题

其中（2）是关于语法的。
其后果是我没有像 clojure 一样区分 list 和 array，
单一的 collection 类型简化了语言，
这个设计来源 shen-lang 对 `[]` 的用法。

clojure 是想在语法上利用 list 和 array 的差异来做一些设计，
比如函数的参数和 let 的 binds 都用 `[]`。
而 shen-lang 是想给 lisp 的 `(list a b c)`
一个更简洁的语法 `[a b c]`。

但是这在想要加入 set 的 literal 语法时产生了问题，
因为如果 `[1 2 3]` 被转化为了 `(tael 1 2 3)`，
读入 sexp 的时候，是没法区分 list 和 array 的。

那么按照这样的设计 `{1 2 3}` 也应该被转化为 `(@set 1 2 3)`，
届时 `(tael 1 2 3)` 可能也应写作 `(@tael 1 2 3)`，
`(quote symbol)` 也应写作 `(@quote symbol)`。

其中（1）是关于语义的。
在 eoc 目前的代码里，
可以发现我几乎没有用到 list with attribute，
都是只用 list 或者只用 record。

这是最令我担忧的，
因为所设计的 feature 没被用到，
证明设计是有问题的。

# 方案

首先语言带有 set 是比较重要的，
因为这能鼓励程序员多用正确的数据类型，
而不是经常用 list 来模拟 set。

这么说，是不是也因该区分 list 和 array 呢？

思考 tael 的代替方案：

（A）clojure 的设计，区分 `list array record set` 四种 literal。

（B）保守的设计，去掉所有语法糖一类的 literal 语法。
明显地用 `(@list) (@array) (@record) (@set)` 来表示 literal。
这种设计是最 scalable 的，并且可以推迟引入 `(@array)`。

但是关于是否融合 `(@list)` 与 `(@record)` 还是需要选择。
如果融合，可以用 `(@tael)`。

（C）放弃一致性，保持现在 tael 的设计，
把 set literal 作为一个 x-data 的数据类型加到 sexp 中。

尽管 set 已经是 X-data 的一部分了，
但是，reader 读到 `{a b c}` 的时候，
也就是 eval `'{a b c}` 的时候，
还是有必要转化为 `['@set 'a 'b 'c]`，
而不能是 `{'a 'b 'c}`。

因为如果 reader 读到 `{(random-dice) (random-dice) (random-dice)}`，
并且直接处理为 set 就是 `{['random-dice]}`，
这显然不是想要的结果。

也就是说 reader 所读到的 sexp 不会包含 set 只能包含 tael，
这种不一致性也让人担忧。

这会导致 x-data 作为保存数据的格式，没法直接保存 set，
只有读到 sexp 之后再经过 eval 才能被视为 set。

# 决定

决定放弃一致性，选方案（C）。
同时放弃 x-data 作为数据交换语言像 JSON 和 EDN 一样的易用性。

具体性修改：

- 在已有的 API 中避免使用 set 这个词。

- 给所有由语法糖生成的语法关键词加上 `@` 前缀：

  - @quote
  - @unquote
  - @quasiquote
  - @tael

  在 x-lisp 中新增 pattern 数据类型，
  并且用 @pattern 来写 literal pattern，
  并且把 pattern 中目前使用的 escape 也加上 @ 前缀 @escape。

  另外在 @tael 之外加上收相应限制的
  @list 和 @record 语法关键词，这两个应该是最常用的。
  一般的 `[]` 还是翻译为 `(@tael)`。

- 最后，也就是我们的目标「添加 set 数据类型」。
  新增 set 数据类型到 x-lisp（先不加到 x-data 试试），
  需要在 x-data 中将 `{}` 翻译为 `@set`。

这个方案的特点是不需要给 x-data 增加数据类型，
x-data 所解析到的 sexp 中最多只有 tael。
