---
title: use
---

# 类型

```scheme
(-> T :type <type>)
```

# 描述

从合并点读取值。`:type` 属性声明结果变量的类型，并为所有匹配的 `provide` operand 提供类型验证依据。

# 例子

```scheme
(= result (use :type value-t))
```
