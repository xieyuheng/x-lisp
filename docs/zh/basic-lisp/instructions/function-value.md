---
title: function-value
---

# 类型

```scheme
(-> value-t :name <symbol> :arity <int>)
```

# 描述

获取命名函数的地址作为 tagged `value-t` 类型值。

`:name` 指定函数符号名，`:arity` 指定函数参数个数。用于将函数作为一等值传递，例如作为闭包的目标或动态调用的参数。

# 例子

```scheme
(= f (function-value :name add-or-sub :arity 3))
