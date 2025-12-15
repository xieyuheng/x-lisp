---
title: x-forth syntax keywords
date: 2025-12-11
---

# definition

方案 A：

```
@variable x
@constant n
@function square [x]
  x x mul
@end
```

方案 B：

```
@variable x
@constant n
@define square [x]
  x x mul
@end
```

方案 C：

```
@var x
@const n
@def square [x]
  x x mul
@end
```

选择「方案 C」。

# binding

用 `[x]` 来声明局部变量，
是致敬 [de bruijn notation](https://en.wikipedia.org/wiki/De_Bruijn_notation)。

语义很相似，但是有差异：

- 在 de bruijn notation 中，
  所有的变量都绑定到函数上，
  因此引用变量的时候，
  也代表了对这个变量的函数进行作用。

- 而在 x-forth 中，
  名字所引用到的 definition 有不同类型。
  只有全局的 function definition 才会在引用时被作用。
  而 `[x]` 所定义的局部变量，
  在引用时会得到函数值本身，
  需要被 explicit 作用。
