# 常见模式（Cookbook）

## 尾递归实现循环

meta-lisp 没有 `for`/`while`。用尾递归函数实现循环。

### 阶乘（累加器模式）

```scheme
(claim factorial (-> int-t int-t))

(define (factorial n)
  (define (iter n acc)
    (if (int-less-or-equal? n 1)
      acc
      (iter (isub n 1) (imul acc n))))
  (iter n 1))
```

### 数列求和

```scheme
(claim sum-list (-> (list-t int-t) int-t))

(define (sum-list xs)
  (define (iter xs acc)
    (match xs
      ((nil) acc)
      ((li head tail) (iter tail (iadd acc head)))))
  (iter xs 0))
```

### GCD（欧几里得算法）

```scheme
(claim gcd (-> int-t int-t int-t))

(define (gcd a b)
  (if (equal? b 0)
    a
    (gcd b (imod a b))))
```

## 函数组合

### pipe

```scheme
(define (add1 x)   (iadd 1 x))
(define (double x) (iadd x x))
(define (square x) (imul x x))

(pipe 5 add1 double)          ;; => 12  (double(add1(5)))
(pipe 5 double add1)          ;; => 11  (add1(double(5)))
(pipe 2 add1 double square)   ;; => 36  (square(double(add1(2))))
```

### chain

```scheme
((chain add1 double) 5)       ;; => 12
((chain double add1) 5)       ;; => 11
((chain add1 double square) 2) ;; => 36
```

### compose

```scheme
((compose add1 double) 5)     ;; => 11  (add1(double(5)))
((compose double add1) 5)     ;; => 12  (double(add1(5)))
```

## 多态数据结构（define-enum）

### 自定义列表

```scheme
(define-enum (my-list-t E)
  (nil)
  (li (head E) (tail (my-list-t E))))
```

生成的函数：

```scheme
(nil)                                   ;; 空列表
(li 1 (li 2 (nil)))                     ;; 列表 [1, 2]
(my-list-map add1 (li 1 (li 2 (nil))))  ;; 映射
```

### 实现 map

```scheme
(claim my-list-map
  (polymorphic (A B)
    (-> (-> A B) (my-list-t A) (my-list-t B))))

(define (my-list-map f list)
  (match list
    ((nil) (nil))
    ((li head tail) (li (f head) (my-list-map f tail)))))
```

### 实现 length

```scheme
(claim my-list-length
  (polymorphic (A) (-> (my-list-t A) int-t)))

(define (my-list-length list)
  (match list
    ((nil) 0)
    ((li head tail) (iadd 1 (my-list-length tail)))))
```

## 也许类型（maybe）

```scheme
(define-enum (maybe-t A)
  (nothing)
  (just (value A)))
```

### 安全除法

```scheme
(claim safe-divide (-> int-t int-t (maybe-t int-t)))

(define (safe-divide a b)
  (if (equal? b 0)
    (nothing)
    (just (idiv a b))))
```

## 私密类型（ADT）

用 `private` 隐藏实现细节，只暴露接口：

```scheme
(module counter)

(claim counter-state int-t)
(define counter-state 0)

(claim increment (-> void-t))
(define (increment)
  (= counter-state (iadd counter-state 1)))

(claim get-count (-> int-t))
(define (get-count)
  counter-state)

(private counter-state)
```

## 多文件项目

```
project/
├── project.json
└── src/
    ├── main.meta
    └── utils.meta
```

```scheme
;; utils.meta
(module utils)

(claim add1 (-> int-t int-t))
(define (add1 x) (iadd x 1))
```

```scheme
;; main.meta
(module main)

(import utils add1)

(define-test add1-test
  (assert-equal 2 (add1 1)))
```

## 用 cond 简化多层 if

```scheme
(define (classify x)
  (cond
   ((int-less? x 0) "negative")
   ((equal? x 0) "zero")
   (else "positive")))
```

## 使用命名约定

- 类型名以 `-t` 结尾：`point-t` `my-list-t` `exp-t`
- 谓词以 `?` 结尾：`int?` `empty?` `pair?`
- 修改器以 `!` 结尾：`set-add!` `hash-put!`
- 构造器用 `make-` 前缀（define-struct 自动生成）
