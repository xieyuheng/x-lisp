---
title: container schema
date: 2025-10-03
---

# 问题

按照现在实现 schema 检查的方式，
没法检查到 list of arrow 的情况：

```scheme
(polymorphic (A) (-> (list? (-> A bool?)) (-> A bool?)))
```

因为 `validate` 在调用 `list?` 的时候，
不会替换 list 中的元素，也不会对元素做副作用。

- 目前带有副作用的地方只有 `tau` 的 attributes。
  这个行为也是值得质疑的。

  我之所以这样处理了，是因为只有函数 attribute 才会遭受这种副作用。
  但是即便如此，这已经影响到 `the` 之后 `equal?` 的判断是否不变了。
  所以这种行为应该是没法接受的。
  因为这意味着开启 debug，不光影响程序的速度，还改变了而程序的行为。

其他类似 list 的 container 类型都不能支持 arrow。

并且这不仅是 container 类型的问题，
所有 arrow as polymorphic parameter 的情况都不行。
比如 `optional?` 和其他用户定义的 polymorphic predicate。

# 方案 A

在 debug 时，每个 value 都带有 meta。
meta 中可以保留一个 `:debug` attribute，
专门用来保存 debug 时才有的信息。

`validate` 处理 arraw schema 时，
直接对 value 的 meta 做 side effect。

在 `apply` 时，如果遇到了 meta 中带有 debug schema 的 value，
就像 `the` 一样处理。

meta 有两种实现方式：

- 一种是 wrapper -- 像 the，和之前的 lazy value 一样。
  在很多时候需啊哟 unwrap。

- 一种是直接在 value 中增加 meta 字段，
  类似 x-data 中现在所做的那样。

可能只有 wrapper 才是合理的，
否则 int 和 float 之类的数据就需要变成指针了。

在 debug 时是可以接受的，
但是 meta 在不是 debug 的正常代码中也会用到，
这种方案就是不能接受的了。

为了保证 meta wrapper 实现正确，
可能需要列举目前所有的 eliminators，
因为只有在 elimination 的过程中，才需要 unwrap。

另外需要注意 meta 对 `same?` 的影响，
现在 `same?` 并不是指针之间的相等，
比如 string 指针不等也可能 same。

问题：

- 但是这个方案好像不太对，
  因为如果 `the` 带有副作用，
  那么一个顶层函数，
  在不同的地方被不同的 `the` 作用，
  两次 `the` 所声明的类型可能是冲突的！

# 方案 B

只有顶层的函数有 schema 支持，
放弃其他情况下函数的 schema 支持。

# 本质

从一个角度看，这个问题的本质是 schema 比 predicate 具有更多职责的。

比如：

- isValid -- schema 可以被用作 predicate。

- generate -- 根据 schema 的描述，生成符合 schema 的随机数据。

- validate -- 检查数据，不修改数据，找到不匹配的具体位置来报错。

- validate + prune -- 检查数据，并且过滤掉没有在 schema 中被表达出来的字段。

- validate + wrap -- 这是我们遇到的情况，
  我们需要函数的 arrow schema 可以 wrap 到 lambda 上，
  在运行 lambda 时，做进一步的 validation。

因为没有静态类型系统，
我们不能检查函数是否符合 arrow，
只能做 wrap，然后在运行时做 validation。
