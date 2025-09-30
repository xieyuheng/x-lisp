---
title: record and key
date: 2025-09-14
---

目前我很满意 x-data 部分的语法，
也就是改良 sexp 使得 sexp 中的 list
可以同时被视为 list 和 record。

但是 record 本身的 API 我不太满意：

```scheme
(record? p target)
(record-length record)
(record-keys record)
(record-values record)
(record-entries record)
(record-append record rest)
(record-copy record)
(record-empty? record)
(record-get key record)
(record-has? key record)
(record-put key value record)
(record-put! key value record)
(record-delete key record)
(record-delete! key record)
(record-map fn record)
```

我主要是对 `record-get` 和 `record-put` 不太满意，
也许可以模仿 clojure 用 `:key` 来简化语法：

```scheme
(assert-equal (record-get 'x [:x 1 :y 2]) 1)
(assert-equal (record-get 'y [:x 1 :y 2]) 2)
(assert-equal (record-get 'z [:x 1 :y 2]) null)
```

```scheme
(assert-equal (:x [:x 1 :y 2]) 1)
(assert-equal (:y [:x 1 :y 2]) 2)
(assert-equal (:z [:x 1 :y 2]) null)
```

但是我想这是做不到的，因为目前 `:key` 是 sexp reader 的一部分，
`'(:x 1 :y 2)` 会被直接读为有两个 attribute 的 record。，
而不会被读为一个有四个 element 的 list，
然后再处理为一个有两个 attribute 的 record。

这导致我们没法把 `:key` 理解为独立的 keyword 数据类型
（或者像 common-lisp 一样理解为 symbol 数据类型），
key 的概念只存在于 literal record 的语法中。

也许可以把 `(get)` 和 `(put)` 作为特殊语法关键词：

```scheme
(get :key record)
(put :key value record)
(put! :key value record)
```

从而把啰嗦的：

```scheme
(assert-equal (record-get 'x [:x 1 :y 2]) 1)
(assert-equal (record-get 'y [:x 1 :y 2]) 2)
(assert-equal (record-get 'z [:x 1 :y 2]) null)
```

简化为更直观的：

```scheme
(assert-equal (get :x [:x 1 :y 2]) 1)
(assert-equal (get :y [:x 1 :y 2]) 2)
(assert-equal (get :z [:x 1 :y 2]) null)
```

`record-get` 之不直观在于写 record 时用的是 `:key`，
但是 get 时用的是 `'key`。

另外一种选择是保持简单，
接受目前的 `record-get` 和 `record-put` 语法。
