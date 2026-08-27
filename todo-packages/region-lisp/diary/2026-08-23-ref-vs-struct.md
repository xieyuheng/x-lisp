---
title: ref vs struct
date: 2026-08-23
---

# (ref) and (deref)

可以设想一种带有 explicit `(ref)` 和 `(deref)` 的语言，
并且生成 accessors 和 modifiers：

```scheme
(define-struct node-t
  (left (ref-t node-t))
  (right (ref-t node-t))
  (value int-t))

(claim main (-> void-t void-t))

(define (main)
  (= node (new node-t))
  (: node (ref-t node-t))
  (: (deref node) node-t)
  (node-put-left node (new node-t))
  (node-put-right node (new node-t))
  (node-put-value node 1))
```

accessors 和 modifiers 的 target 参数的类型是 `(ref-t T)`，
因为根据 scalable-c 的代码风格 `(ref-t T)` 是主要使用情况。

# pre-scheme of scheme48

在 scheme48 所设计的 pre-scheme 中，
用 `(define-record)` 定义的类型都是指针类型：

```scheme
(define-record point
  (x integer)
  (y integer))

(define (move-point! (p point) (dx integer) (dy integer))
  (set-point-x! p (+ (point-x p) dx))
  (set-point-y! p (+ (point-y p) dy)))

(define p (make-point 1 2))
(define q p)               ; q 和 p 指向同一个 record

(set-point-x! q 10)
(point-x p)                ; 返回 10，说明 p 和 q 共享同一底层结构
```

类似于 c struct 的指针：

```c
truct point {
  long x;
  long y;
};

void move_point(struct point *p, long dx, long dy) {
  p->x = p->x + dx;
  p->y = p->y + dy;
}
```

## 空指针

和 c 一样允许空指针怎。

Pre-Scheme 提供了两个关键操作：

- (null-pointer type)：返回 type 类型的空指针。
- (null-pointer? expr)：检查表达式是否为对应类型的空指针。

其中 type 是 record 类型名（不需要引号），也可以是 (pointer T) 等指针类型。

```scheme
(define-record point
  (x integer)
  (y integer))

(define (safe-point-x (p point))
  (if (null-pointer? p)
      0                     ; 默认值
      (point-x p)))

(define empty (null-pointer point))   ; 空指针
(null-pointer? empty)                 ; => #t
```

## 可选字段

关于可选字段，
由于 record 类型本身是指针且可以为 NULL，
可选字段不需要任何包装或特殊类型，
直接声明为对应的 record 类型即可。

类型系统不区分「这个字段一定非空」和「这个字段可能为空」，
完全由程序员负责保证使用前的检查。

```scheme
(define-record tree-node
  (value integer)
  (left tree-node)    ; 左子树，可能为空
  (right tree-node))  ; 右子树，可能为空

;; 创建叶子节点：左右子树均为空指针
(define (make-leaf (v integer))
  (make-tree-node
   v
   (null-pointer tree-node)
   (null-pointer tree-node)))

;; 递归求和，显式检查空指针
(define (tree-sum (node tree-node))
  (if (null-pointer? node)
    0
    (+ (tree-node-value node)
       (tree-sum (tree-node-left node))
       (tree-sum (tree-node-right node)))))
```

## 没有 struct 的局限

由于没有 struct，
只能表达 array of struct pointer，
而不能表达 array of struct。

# 改良 pre-scheme

如果想在 pre-scheme 的默认使用 pointer of struct 的设计基础上，
设计新的语法和类型，来支持对 struct 的操作，应该如何设计？

模仿保持 `(define-record)` 的语义不变，
但是模仿 meta-lisp 和 c 给类型加上 `-t` 后缀，
另外引入新的类型构造器 `(struct <record-name>)`。

```scheme
(define-record point-t
  (x int-t)
  (y int-t))
```

| scheme           | c              | 说明                    |
|------------------|----------------|-------------------------|
| point-t          | struct point * | 指向 point 结构体的指针 |
| (struct point-t) | struct point   | point 结构体的值        |

与 c 相反，c 是结构体指针需要额外标记，
pre-scheme 是结构体需要额外标记。

自动生成的函数：

- 构造器：make-point（堆分配，返回指针）
- 访问器：point-x（接受指针）
- 修改器：point-put-x（接受指针）
- 值构造器：make-point-value（直接构造值）
- 值构造器：point-value（从指针返回一个值）
- 值访问器：point-value-x（接受值）
- 值修改器：point-value-put-x（接受值，通常不常用，因为值修改需要左值）

另外可以引入 `(ref)` 使得 `(ref (struct point-t)) == point-t`。

## 关于泛型的 size

可以约定只有指针类型可以作为泛型。
这样就没有需要为不同 size 的泛型生成不同代码的问题了。
正如 scalable-c 在 c 中使用 `void*` 实现没有类型检查的泛型的方式类似。

## 关于空指针

可以考虑引入 `(nullable T)` 这种类型构造子。
之后 `point-t` 不可为 null，`(nullable point-t)` 可为 null。
但是，这样会引入子类型关系，因为 `point-t` 是 `(nullable point-t)` 的子类型。

引入子类型关系之后，需要为 `(if)` 之类的分支控制流实现类型收窄。
并且 HM 类型推导的完备性会被破坏。

除非我们避免子类型关系，要求 `point-t` 到 `(nullable point-t)` 也必须显式转换。
并且设计专门的语法关键词来处理 `(nullable point-t)` 的两种分支情况。

为了区分 void 和 null，
也许 void 可以翻译为「空」，代表「返回值为空」，
而 null 可以翻译为「缺」，代表「引用缺失」。
