---
title: symbol-append
---

# 类型

```scheme
(-> symbol-t symbol-t symbol-t)
```

# 描述

拼接两个符号，生成一个新符号。

# 例子

```scheme
(symbol-append 'foo 'bar)  ;; => 'foobar
(symbol-append 'a 'b)      ;; => 'ab
```
