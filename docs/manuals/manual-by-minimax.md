# Meta-Lisp 语言参考手册

## 目录

1. [概述](#1-概述)
2. [基本语法](#2-基本语法)
3. [类型系统](#3-类型系统)
4. [代数数据类型](#4-代数数据类型)
5. [接口与记录](#5-接口与记录)
6. [多态性](#6-多态性)
7. [模块系统](#7-模块系统)
8. [模式匹配](#8-模式匹配)
9. [语法糖](#9-语法糖)
10. [内置函数](#10-内置函数)
11. [编译流程](#11-编译流程)

---

## 1. 概述

Meta-Lisp 是一种静态类型的类 Lisp 语言，设计目标是为快速原型化新计算模型提供支持。它结合了 Lisp 的简洁语法与现代类型系统的安全性。

### 主要特性

- **静态类型系统**：完整的 Hindley-Milner 类型推断
- **代数数据类型**：支持参数化数据类型与模式匹配
- **Row Polymorphism**：灵活的接口扩展与子类型关系
- **模块系统**：清晰的模块边界与导入机制
- **自举设计**：用 Meta-Lisp 编写自身的编译器

---

## 2. 基本语法

Meta-Lisp 使用 S-表达式作为基本语法结构。

### 2.1 注释

```meta
;; 单行注释
```

### 2.2 模块声明

每个 `.meta` 文件以模块声明开头：

```meta
(module my-module)
```

### 2.3 基本表达式

```meta
;; 变量引用
x

;; 字面量
42          ;; 整数
3.14        ;; 浮点数
"hello"     ;; 字符串
' Symbol   ;; 符号
true false  ;; 布尔值

;; 函数调用
(function-name arg1 arg2)

;; lambda 表达式
(lambda (x) (+ x 1))
```

### 2.4 定义

```meta
;; 顶层值定义
(define pi 3.14159)

;; 函数定义
(define (add a b) (+ a b))

;; 带类型声明的函数
(claim add (-> int-t int-t int-t))
(define (add a b) (+ a b))
```

---

## 3. 类型系统

Meta-Lisp 采用渐进式类型推断，主要类型包括：

### 3.1 基本类型

| 类型 | 描述 |
|------|------|
| `int-t` | 整数类型 |
| `float-t` | 浮点数类型 |
| `bool-t` | 布尔类型 |
| `string-t` | 字符串类型 |
| `symbol-t` | 符号类型 |
| `void-t` | 空类型（用于无返回值函数） |
| `type-t` | 类型本身（用于元编程） |

### 3.2 函数类型

```meta
;; (-> A B C) 表示 A -> B -> C，即接受 A 和 B，返回 C
(claim length (-> (list-t int-t) int-t))

;; 带effect的类型标注
;; 纯函数使用 ->，带副作用函数使用 = ->
(claim list-push (polymorphic (E) (-> E (list-t E) (list-t E))))
(claim list-push! (polymorphic (E) (= -> E (list-t E) (list-t E))))
```

### 3.3 类型推断

```meta
;; 未显式标注类型的函数会被推断
(define (double x) (+ x x))
;; 推断结果: (-> int-t int-t)
```

### 3.4 类型声明 (claim)

`claim` 用于声明函数的类型签名：

```meta
(claim function-name type-expression)
```

支持的类型表达式：

- 基本类型：`int-t`, `float-t`, `bool-t`, `string-t` 等
- 函数类型：`(-> A B R)` 或 `(= -> A B R)`
- 参数化类型：`(list-t E)`, `(set-t E)`, `(hash-t K V)`
- 多态类型：`(polymorphic (A B) ...)`
- 接口类型：`point-t`, `container-t` 等

---

## 4. 代数数据类型

### 4.1 定义数据类型

```meta
;; 简单枚举类型
(define-data color-t
  (red)
  (green)
  (blue))

;; 带参数的类型
(define-data (maybe-t A)
  (nothing)
  (just A))

;; 递归类型
(define-data (list-t E)
  (nil)
  (cons (head E) (tail (list-t E))))

;; 复杂递归类型
(define-data exp-t
  (var-exp (name symbol-t))
  (apply-exp (target exp-t) (arg exp-t))
  (lambda-exp (parameter symbol-t) (body exp-t))
  (let-exp (name symbol-t) (rhs exp-t) (body exp-t)))
```

### 4.2 数据构造

```meta
;; 使用构造器创建值
(nil)
(cons 1 (cons 2 (cons 3 nil)))
(just 42)
(var-exp 'x)
```

### 4.3 类型检查与模式匹配

```meta
;; 使用 match 进行模式匹配
(define (length lst)
  (match lst
    ((nil) 0)
    ((cons _ rest) (+ 1 (length rest)))))
```

---

## 5. 接口与记录

### 5.1 定义接口

```meta
;; 简单接口
(define-interface point-t
  :x float-t
  :y float-t)

;; 接口继承
(define-interface colored-point-t
  :color string-t)
;; colored-point-t 隐式包含 point-t 的字段
```

### 5.2 创建记录

```meta
;; 使用 @record 创建记录
(@record :x 1.0 :y 2.0)
(@record :x 1.0 :y 2.0 :color "red")
```

### 5.3 访问字段

```meta
;; 使用 :field-name 访问字段
(:x point)
(:y point)
```

### 5.4 Row Polymorphism

Meta-Lisp 支持行多态，允许函数接受带有额外字段的记录：

```meta
(claim point-y
  (polymorphic (R A)
    (-> (extend-interface R :y A) A)))

(define (point-y point)
  (:y point))

;; 可以用于任何带有 :y 字段的记录
(point-y (@record :x 1.0 :y 2.0))
(point-y (@record :x 1.0 :y 2.0 :color "red"))
```

### 5.5 记录操作

```meta
;; 扩展记录（纯函数，返回新记录）
(define (with-color color point)
  (extend point :color color))

;; 更新记录（可能带副作用）
(define (point-put-x x point)
  (update point :x x))

;; 带有 ! 表示可能修改原记录
(define (point-put-y! y point)
  (update! point :y y))
```

---

## 6. 多态性

### 6.1 参数多态

使用 `polymorphic` 声明多态函数：

```meta
;; identity 函数
(claim identity
  (polymorphic (A) (-> A A)))
(define (identity x) x)

;; compose 函数
(claim compose
  (polymorphic (A B C)
    (-> (-> B C) (-> A B) (-> A C))))
(define (compose f g x) (f (g x)))

;; 参数化数据类型
(define-data (my-list-t E)
  (nil)
  (li (head E) (tail (my-list-t E))))
```

### 6.2 类型约束

接口可以用作类型约束：

```meta
;; 假设 container-t 接口定义了 size 字段
(claim get-size
  (polymorphic (C) (-> C int-t)))
```

---

## 7. 模块系统

### 7.1 模块定义

```meta
(module my-module)
```

### 7.2 导入模块

```meta
;; 在另一个文件中导入
(import my-module)

;; 使用限定名访问
(my-module::function-name)
```

### 7.3 导出控制

默认情况下，模块中定义的所有内容都是私有的。使用 `_` 开头的名称表示导出的公共 API：

```meta
;; 私有函数（外部不可访问）
(define (internal-helper x) ...)

;; 公共函数
(define (public-api x) ...)
```

---

## 8. 模式匹配

### 8.1 基本模式

```meta
(match value
  (pattern1 result1)
  (pattern2 result2)
  ...)
```

### 8.2 模式种类

```meta
;; 字面量模式
(match x
  (0 "zero")
  (1 "one")
  (_ "other"))

;; 构造函数模式
(match my-list
  ((nil) "empty")
  ((cons h t) (list-to-string h)))

;; 绑定模式
(match pair
  ((pair a b) (+ a b)))
```

### 8.3 守卫条件

```meta
;; 在模式后使用 when 添加条件
(match n
  ((cons x rest) (when (> x 0) x))
  (_ 0))
```

---

## 9. 语法糖

### 9.1 let 绑定

```meta
;; let 语法
(let ((x 1)
      (y 2))
  (+ x y))

;; let* 语法（连续绑定）
(let* ((x 1)
       (y (+ x 1)))
  (+ x y))
```

### 9.2 条件表达式

```meta
;; if 表达式
(if condition then-expr else-expr)

;; cond 表达式
(cond
  ((condition1) result1)
  ((condition2) result2)
  (else result-default))
```

### 9.3 布尔运算

```meta
;; 逻辑与 (短路求值)
(and condition1 condition2 ...)

;; 逻辑或 (短路求值)
(or condition1 condition2 ...)

;; 逻辑非
(not condition)
```

---

## 10. 内置函数

### 10.1 整数运算

```meta
(iadd a b)      ;; 整数加法
(isub a b)      ;; 整数减法
(imul a b)      ;; 整数乘法
(idiv a b)      ;; 整数除法
(imod a b)      ;; 整数取模
(ilt a b)       ;; 小于
(igt a b)       ;; 大于
(ieq a b)       ;; 相等
```

### 10.2 浮点数运算

```meta
(fadd a b)
(fsub a b)
(fmul a b)
(fdiv a b)
(flt a b)
(fgt a b)
(feq a b)
```

### 10.3 列表操作

```meta
(make-list)                    ;; 创建空列表
(cons head tail)               ;; 构造列表
(car list)                     ;; 取首元素
(cdr list)                     ;; 取尾元素
(list-length list)             ;; 列表长度
(list-get index list)          ;; 索引访问
(list-empty? list)             ;; 是否为空
(list-map f list)              ;; 映射
(list-fold init f list)        ;; 折叠
(list-select pred list)        ;; 过滤
```

### 10.4 哈希表操作

```meta
(make-hash)                   ;; 创建空哈希表
(hash-get key hash)            ;; 获取值
(hash-put key value hash)      ;; 设置值 (返回新哈希表)
(hash-put! key value hash)     ;; 设置值 (可能修改原哈希表)
(hash-has? key hash)          ;; 检查键是否存在
(hash-keys hash)              ;; 获取所有键
(hash-values hash)            ;; 获取所有值
(hash-entries hash)           ;; 获取所有键值对
```

### 10.5 集合操作

```meta
(make-set)                    ;; 创建空集合
(set-add elem set)            ;; 添加元素 (返回新集合)
(set-add! elem set)           ;; 添加元素 (可能修改)
(set-has? elem set)           ;; 检查元素是否存在
(set-delete elem set)         ;; 删除元素
(set-elements set)            ;; 获取所有元素
```

### 10.6 字符串操作

```meta
(string-length str)           ;; 字符串长度
(string-get index str)        ;; 字符访问
(string-concat str1 str2)     ;; 字符串连接
(string-slice start end str)  ;; 字符串切片
(string-equal? str1 str2)     ;; 字符串相等
```

### 10.7 文件与 I/O

```meta
(file-read path)              ;; 读取文件
(file-write path content)    ;; 写入文件
(file-exists? path)          ;; 检查文件是否存在
(current-directory)          ;; 获取当前目录
(fs-read-dir path)           ;; 读取目录
```

### 10.8 随机数

```meta
(random-int max)             ;; 生成 0 到 max-1 之间的随机整数
(random-float)              ;; 生成 0.0 到 1.0 之间的随机浮点数
```

---

## 11. 编译流程

Meta-Lisp 编译器采用多阶段 Pipeline 设计，将源代码编译为栈式虚拟机指令。

### 11.1 编译阶段

| 阶段 | 名称 | 描述 |
|------|------|------|
| 006 | ExpandPass | 展开宏和语法糖 |
| 007 | ImportPass | 解析和导入模块 |
| 008 | ExecutePass | 执行顶层表达式 |
| 009 | ClaimPass | 处理类型声明 |
| 010 | DesugarPass | 脱糖，去除语法糖 |
| 020 | CheckPass | 类型检查 |
| 030 | QualifyPass | 限定化名称 |
| 040 | LocatePass | 定位定义 |
| 050 | ShrinkPass | 收缩类型 |
| 060 | UniquifyPass | 唯一化变量名 |
| 070 | LiftLambdaPass | 提升 lambda |
| 080 | UnnestOperandPass | 展开嵌套操作数 |
| 090 | ExplicateControlPass | 显式化控制流 |
| 100 | CodegenPass | 生成目标代码 |

### 11.2 输出格式

编译输出两种 IR 格式：

- **Basic IR**：高级中间表示
- **Stack IR**：栈式虚拟机指令

### 11.3 使用方法

```bash
# 构建项目
meta-lisp build <project-path>

# 检查类型（不生成代码）
meta-lisp check <file.meta>

# 运行测试
meta-lisp test <project-path>
```

---

## 附录

### A. 关键字列表

```meta
module        ;; 模块声明
import        ;; 导入模块
define        ;; 定义函数或值
define-data   ;; 定义代数数据类型
define-interface ;; 定义接口
define-test   ;; 定义测试用例
claim         ;; 类型声明
match         ;; 模式匹配
lambda        ;; lambda 表达式
if            ;; 条件表达式
cond          ;; 多分支条件
let, let*     ;; 局部绑定
polymorphic   ;; 多态类型
declare-primitive-function ;; 声明原始函数
```

### B. 命名约定

- 类型名通常以 `-t` 结尾（如 `int-t`, `list-t`）
- 布尔谓词通常以 `?` 结尾（如 `empty?`, `has?`）
- 修改原值的函数通常以 `!` 结尾（如 `set-add!`, `list-push!`）

### C. 错误处理

```meta
;; 抛出错误
(error "error message")

;; 捕获错误（通过模式匹配）
(match (try-expression)
  ((ok value) value)
  ((err message) (handle-error message)))
```

---

*本文档由 MiniMax 根据 Meta-Lisp 源代码分析生成。*