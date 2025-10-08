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

- 目前带有副作用的地方只有 tau 的 attributes。

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
