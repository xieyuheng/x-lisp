---
title: compiling define-datatype
date: 2026-02-26
---

为了保持类型检查器简单，
可能应该从语法上区分 list、record 和 tau。

也就是说，为了方便简单类型系统的类型检查，
应该避免子类型关系：

- void-t < hashtag-t
- null-t < hashtag-t
- bool-t < hashtag-t
- tau-t < list-t
- tau-t < record-t
- T < any-t

进一步，为了保持简单，
应该避免所有子类型关系，
尤其是 record 之间，
也就是 class 之间的子类型关系。

如果需要在 semigroup-t monoid-t group-t 之间转化，
可以定义明显的转化函数。

这无疑是说，不能用 subclass 的方式，来重用证明。
这样的限制合理吗？

感觉是不合理的，而是需要 subclass，
并且这是核心 feature 之一。

尽管如此：

- 放弃 tael，改为区分 list 和 record。
- 放弃用 hashtag-t 代表 void 和 null。

可能还是合理的。
