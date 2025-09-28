---
title: polymorphic and specific
date: 2025-09-26
---

今天设计了两个新的关于 schema 的语法关键词
-- `polymorphic` 和 `specific`。

使得 `claim` 可以表达 polymorphic 的函数类型，
调用函数的时候可以用 specific 来给 polymorphic parameter
传递 predicate 参数。

```scheme
(claim list-append
  (polymorphic (A)
    (-> (list? A) (list? A)
        (list? A))))

(define (list-append list tail)
  (if (list-empty? list)
    (list-of tail)
    (cons (car list) (list-append (cdr list) tail))))
```

```scheme
(assert-equal
  (list-append [1 2 3] [4 5 6])
  [1 2 3 4 5 6])

(assert-equal
  ((specific list-append int?) [1 2 3] [4 5 6])
  [1 2 3 4 5 6])
```

# 类似的设计

类似的也设计 `forall` 和 `exists` 这两个语法关键词，
给 schema 加上类似 dependent type 的功能。

# 反思

我差点就认为 schema 不应该有 polymorphic 功能了。

一定要注意，当你设计的方案有缺陷时，不要把这些缺陷合理化。
而是要实事求是面对这些缺陷，因为只有这样，你才有可能找到方案解决这些缺陷。
