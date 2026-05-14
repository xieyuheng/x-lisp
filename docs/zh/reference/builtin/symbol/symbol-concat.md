---
title: symbol-concat
---

# 类型

```scheme
(-> (list-t symbol-t) symbol-t)
```

# 描述

拼接一个符号列表，生成一个新符号。

# 例子

```scheme
(symbol-concat ['foo 'bar 'baz])  ;; => 'foobarbaz
(symbol-concat [])                ;; => ''
(symbol-concat ['a 'b])           ;; => 'ab
```
