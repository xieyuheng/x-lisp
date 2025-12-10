---
title: x-forth syntax keywords
date: 2025-12-11
---

方案 A：

```ruby
@variable x
@constant n
@function square ( x )
  x x mul
@end
```

方案 B：

```ruby
@variable x
@constant n
@define square ( x )
  x x mul
@end
```

方案 C：

```ruby
@var x
@const n
@def square ( x )
  x x mul
@end
```

选择「方案 C」。
