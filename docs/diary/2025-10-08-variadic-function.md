---
title: variadic function
date: 2025-10-08
---

今天实现了 variadic function，
甚至不需要新的语法关键词，
直接用 lambda 就可以。

`->` 之外需要增加 `*->`，
`*` 放在箭头前面，代表参数是 variadic list。

这个功能主要是为了能，把之前用语法关键词实现的
-- compose pipe union inter，可以用函数实现。

只是因为它们的参数个数可变，
就定义为语法关键词，这太小题大做了。

```scheme
(claim compose
  (*-> (-> anything? anything?)
       (-> anything? anything?)))

(define compose
  (lambda fs
    (if (list-empty? fs)
      (lambda (x) x)
      (lambda (x)
        ((apply compose (list-init fs))
         ((list-last fs) x))))))
```

但是需要提醒，谨慎使用 variadic function。

因为这种函数不能直接 curry。

比如，`string-append` 和 `list-append` 等等，
都没有用 variadic function。

因为如何 append 用了，那么 add 和 mul 是否也用该用。
一个用了，按照对称性，很多都要用。
但是一旦用的多了，很多函数就都不能 curry 了。
所以要谨慎使用。
