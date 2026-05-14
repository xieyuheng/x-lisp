---
title: string-replace
---

# 类型

```scheme
(-> string-t string-t string-t string-t)
```

# 描述

将字符串中所有出现的 `old` 替换为 `new`。

# 例子

```scheme
(string-replace "hello world" "world" "there")  ;; => "hello there"
(string-replace "aaa" "a" "b")                  ;; => "bbb"
(string-replace "abc" "x" "y")                  ;; => "abc"
```
