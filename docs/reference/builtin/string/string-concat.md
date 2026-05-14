---
title: string-concat
---

# 类型

```scheme
(-> (list-t string-t) string-t)
```

# 描述

拼接一个字符串列表，等价于对列表中的字符串依次应用 `string-append`。

# 例子

```scheme
(string-concat ["a" "b" "c"])  ;; => "abc"
(string-concat [])             ;; => ""
(string-concat ["hello " "world"])  ;; => "hello world"
```
