---
title: about dot syntax
date: 2025-10-30
---

长期以来，我一直认为很难为 lisp 设计 OOP 中的 dot 语法。

今天在尝试设计类似 C 的 system-lisp 中的 struct 功能时，
我发现可以完全舍弃 dot 语法，而改用生成 identifiers：

```scheme
(define-struct (node-t A)
  (prev (optional (node-t A)))
  (next (optional (node-t A)))
  (value A))

(define-struct (list-t A)
  (first (optional (node-t A)))
  (last (optional (node-t A)))
  (cursor (optional (node-t A)))
  (length int-t)
  (free-fn (optional (-> A void-t)))
  (equal-fn (optional (-> A A bool-t)))
  (copy-fn (optional (-> A A))))

(claim new-list (polymorphic (A) (-> (list-t A))))

(define (new-list)
  (new list-t :length 0))

(claim list-free (polymorphic (A) (-> (list-t A) void-t)))

(define (list-destroy self)
  (list-purge self)
  (free self))

(claim list-purge (polymorphic (A) (-> (list-t A) void-t)))

(define (list-purge self)
  (= node (list-first self))
  (while (not (null? node))
    (= next (node-next node))
    (unless (null? (list-free-fn self))
      ((list-free-fn self) (node-value node)))
    (free node)
    (= node next))
  (list-put-first! null self)
  (list-put-last! null self)
  (list-put-cursor! null self)
  (list-put-length! 0 self))
```

类似的，之前设计的 cicada-lisp 中的 OOP 语法，
也可以从使用 `:` 作为 dot 语法：

```scheme
(define-class functor-t ()
  (claim dom category-t)
  (claim cod category-t)
  (claim map (-> dom:object-t cod:object-t))
  (claim fmap (implicit ((x dom:object-t)
                         (y dom:object-t))
                (forall ((f (dom:morphism-t x y)))
                  (cod:morphism-t (map x) (map y)))))
  (claim fmap-preserve-compose
    (implicit ((x dom:object-t)
               (y dom:object-t)
               (z dom:object-t))
      (forall ((f (dom:morphism-t x y))
               (g (dom:morphism-t y z)))
        (equal-t (cod:morphism-t (map x) (map z))
          (fmap (dom:compose f g))
          (cod:compose (fmap f) (fmap g))))))
  (claim fmap-preserve-id
    (forall ((x dom:object-t))
      (equal-t (cod:morphism-t (map x) (map x))
        (fmap (dom:id x))
        (cod:id (map x))))))
```

改为生成 identifiers：

```scheme
(define-class functor-t ()
  (dom category-t)
  (cod category-t)
  (map (-> (category-object-t dom) (category-object-t cod)))
  (fmap (implicit ((x (category-object-t dom))
                   (y (category-object-t dom)))
          (forall ((f (category-morphism-t dom x y)))
            (category-morphism-t cod (map x) (map y)))))
  (fmap-preserve-compose
   (implicit ((x (category-object-t dom))
              (y (category-object-t dom))
              (z (category-object-t dom)))
     (forall ((f (category-morphism-t dom x y))
              (g (category-morphism-t dom y z)))
       (equal-t (category-morphism-t cod (map x) (map z))
         (fmap (category-compose dom f g))
         (category-compose cod (fmap f) (fmap g))))))
  (fmap-preserve-id
   (forall ((x (category-object-t dom)))
     (equal-t (category-morphism-t cod (map x) (map x))
       (fmap (category-id dom x))
       (category-id cod (map x))))))
```

相比 dot 语法，这样更简单，看起来也更和谐。

# 反思

我差点又因为 lisp 不好设计 dot 语法，而放弃了 system-lisp。

这次没放弃是因为：

- 想起了 "OOP is absurd" 这条 belief。
  而这条 belief 的推论是：不应该为了 dot 语法而全盘接受 OOP。

- 已经实现的 x-lisp 中没有 dot 语法也用的好好的。

注意，如果之后需要大量使用到 structural record，
可能还是要为 x-lisp 的 record 语法加上 `get` 和 `put!` 语法关键词，
以代替 `record-get` 和 `record-put!`。
