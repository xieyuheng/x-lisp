---
title: symbol-append
---

# 类型

```meta-lisp
(-> symbol-t symbol-t symbol-t)
```

# 描述

拼接两个符号，生成一个新符号。

# 例子

```meta-lisp
(symbol-append 'foo 'bar)  ;; => 'foobar
(symbol-append 'a 'b)      ;; => 'ab
```
