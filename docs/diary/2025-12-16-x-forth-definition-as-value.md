---
title: x-forth definition as value
date: 2025-12-16
---

把 `definition_t` 实现为 `object_t`。
用 `@ref <name>` 来获得这种 value。

这个功能可以不暴露给 x-lisp。

# apply and curry

apply 要用 instruction 实现，
因为不暴露给 x-lisp 的功能都应该用 instruction 实现。

```
<arg> ... @ref <name> <arity> @apply
<arg> ... @ref <name> <arity> @tail-apply
```

# variable assignment

这功能也可以用 definition as value 来实现：

```
<value> @ref <name> @assign
```
