---
title: text-concat
---

# 类型

```meta-lisp
(-> (list-t text-t) text-t)
```

# 描述

拼接一个字符串列表，等价于对列表中的字符串依次应用 `text-append`。

# 例子

```meta-lisp
(text-concat ["a" "b" "c"])  ;; => "abc"
(text-concat [])             ;; => ""
(text-concat ["hello " "world"])  ;; => "hello world"
```
