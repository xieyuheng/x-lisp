---
title: scheme plus structural typing
date: 2025-06-06
---

# Motive

在学习 jeremy siek 的编译器课程时，
又复习了一下 abdulaziz ghuloum 的编译器课程。
后者的特点是不用 ADT，直接处理 sexp。
这让人想到可以给 scheme 的 list 加 structural typing，
就像 typescript 对 javascript 所做的那样。

# Design

用 `tau` 来声明形如 list 的 structural type。

```scheme
(define exp-t (union var-t int-t prim-t fn-t ap-t let-t))
(define var-t symbol-t)
(define let-t (tau 'let (list-t (tau symbol-t exp-t)) . (list-t exp-t)))
(define fn-t (tau 'lambda (list-t symbol-t) . (list-t exp-t)))
(define ap-t (tau exp-t . (list-t exp-t)))
(define program-t (tau 'program info-t . (list-t exp-t)))
```

上面的 `(tau 'lambda (list-t symbol-t) . (list-t exp-t))` 有歧义，
因为按照 `.` 的意义，
它会被解析为 `(tau 'lambda (list-t symbol-t) list-t exp-t)`。
所以不能把 `.` 解析为 list 的 cons。

但是我选择完全放弃用 cons 实现 list，
而是要求 list 的最后一个 cdr 必须是 null。
实现 list 的时候，可以直接用 array 或者 list of cache sized-array。
并且用 regular expression 来描述 list 的类型，
以避免上面提到的用 `.` 表示 rest 的问题。

在 `tau` 中 `one-or-more` 和 `zero-or-more` 有特殊意义。

```scheme
(define exp-t (union var-t int-t prim-t fn-t ap-t let-t))
(define var-t symbol-t)
(define let-t (tau 'let (list-t (tau symbol-t exp-t)) (one-or-more exp-t)))
(define fn-t (tau 'lambda (list-t symbol-t) (one-or-more exp-t)))
(define ap-t (tau exp-t (zero-or-more exp-t)))
(define program-t (tau 'program info-t (one-or-more exp-t)))
```

此时，我们可以描述 `tau` 类数据的 structural type 为：

```scheme
(define tau-t (tau 'tau (zero-or-more tau-pattern-t)))
(define tau-pattern-t
  (union (tau 'one-or-more exp-t)
         (tau 'zero-or-more exp-t)
         exp-t))
```

在 type 中使用 regular expression 是可以的，
但是在 pattern 中没法使用 regular expression。
然而 type 与 pattern 应该是能够相互对应的。
所以上面的设计可能不对。

也许就应该模仿 clojure，不给 `.` 以特殊解释 lisp。
为了避免所出现的 `.` 让 lisper 误会，用 `&` 表述 rest。

```scheme
(claim list-length
  (nu (A) (-> (list-t A) integer-t)))
(define (list-length list)
  (match list
    ([] 0)
    ([head & tail]
     (add1 (list-length tail)))))
```

```scheme
(define exp-t (union var-t int-t prim-t fn-t ap-t let-t))
(define var-t symbol-t)
(define let-t (tau 'let (list-t (tau symbol-t exp-t)) & (list-t exp-t)))
(define fn-t (tau 'lambda (list-t symbol-t) & (list-t exp-t)))
(define ap-t (tau exp-t & (list-t exp-t)))
(define program-t (tau 'program info-t & (list-t exp-t)))
```

但是这样会导致我们没法用 tau 描述 `tau` 类表达式的 structural type，
反而是需要 `zero-or-more` 才能表达这种类型的数据：

```scheme
(define tau-t
  (union (tau 'tau (zero-or-more exp-t))
         (tau 'tau (zero-or-more exp-t) '& exp-t)))
```

也许应该用 `tau*` 类似 scheme 的 `cons*` 和 pie 的 `->`：

```scheme
(define exp-t (union var-t int-t prim-t fn-t ap-t let-t))
(define var-t symbol-t)
(define let-t (tau* 'let (list-t (tau symbol-t exp-t)) (list-t exp-t)))
(define fn-t (tau* 'lambda (list-t symbol-t) (list-t exp-t)))
(define ap-t (tau* exp-t (list-t exp-t)))
(define program-t (tau* 'program info-t (list-t exp-t)))
```

感觉这才是正解！

在 pattern 中也许可以直接使用 `cons`：

```scheme
(claim list-length
  (nu (A) (-> (list-t A) integer-t)))
(define (list-length list)
  (match list
    ([] 0)
    ((cons head tail)
     (add1 (list-length tail)))))
```

和 `cons*`：

```scheme
(match list
  ((cons* x y tail) ...))
```

还有一个问题是如何在 pattern 中，
把 `tau*` 和 `->` 中的最后一个元素直接 match 出来？

目前是只能用 cons 来 match tail，
然后在 pattern 所对应的代码中，特殊处理最后一个元素：

```scheme
(match type
  ((cons 'tau* exps)
   (let ((prefix-types (list-map (remove-last exps) (evaluate env)))
         (rest-type (evaluate env (last exps))))
     ...))
  ((cons '-> exps))
  (let ((arg-types (list-map (remove-last exps) (evaluate env)))
        (return-type (evaluate env (last exps))))
    ...))
```

也许这样已经足够了，是最灵活的处理方式。

# More Examples

可以尝试用这种类型系统去给 abdulaziz ghuloum 的课程代码加类型，
正如给 javascript 项目加 typescript 类型。

# List with Attributes

可以扩展 lisp 的 list 语义，
是的 list 可以像 XML 一样可以带 attributes。
注意，list 的 head 是 XML 的 tag 的作用，
但 tag 只能是 string，而 list 的 head 可以是 list。

我们不用 `list`，而是用 `make-list` 来构造 list，
这样可以避免占用一个常用的变量名：

```scheme
(make-list 'lambda (make-list 'x) 'x :span (make-list :start 0 :end 10))
```

并且让 `[...]` 展开成 `(make-list ...)`。

```scheme
['lambda ['x] 'x :span [:start 0 :end 10]]
```

这是从 shen-lang 学的，比如：

```scheme
'(a b c) => ['a 'b 'c] => (make-list 'a 'b 'c)
```

注意，如果这样使用 `[...]`
那么在就不能在 `let` 和 `cond` 中使用 `[]` 了，
这也许是好事。

如果要实现这样的 list with attributes，
就不能用简单的 cons 了，
每个 list 其实都是 list + map。
cdr 一个 list 的时候，会把 map 传递给 tail。
要有两个平行的数据，而不能直接把 attributes 保存在 list 里。

在 javascript 中，可以直接用 array 实现 list：

```typescript
type Data = Atom | List
type List = { kind: "List", content: Array<Data>, attributes: Attributes }
type Attributes = Record<string, Data>
```

# Atom with Attributes

如果支持 list with attributes，
那么就也要支持 atom with attributes。
因为只有这样才能让 parse 所得的 atom（比如 symbol）带有 span。

在 javascript 中可以实现如下：

```typescript
type Atom = Bool | String | Int | Float
type Bool = { kind: "Bool"; content: boolean; attributes: Attributes }
type String = { kind: "String"; content: string; attributes: Attributes }
type Int = { kind: "Int"; content: number; attributes: Attributes }
type Float = { kind: "Float"; content: number; attributes: Attributes }
```

在 lisp 中要写带有 attributes 的 atom 时可以用 `quote`。

比如，对简单的 `'x` 和带有 `:span` attribute 的 `'x`：

```scheme
'x
(quote x)

;; with attribute:
(quote x :span [:start 0 :end 1])
```

# Bool and Special Constants

Bool 类型的两个值 `#t` 与 `#f`，
是 special constants 的例子。

这样可以避免在 parsing 的过程中，
把 true 和 false 处理成特殊的 symbol。

比如：

```scheme
'(true false)
```

list 中的两个元素是 symbol 还是 bool 是有歧义的。

而用 `#` 来代表 special constants 就没有歧义：

```scheme
'(#t #f)
```

这要求了任何 symbol 不能以 `#` 开头。

但是由于我们把 symbol 和 string 融合了，
所以如果需要还是可以写出来 `"#t"`。
