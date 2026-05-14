# 内置函数参考

内置函数分为两类：

- **Primitive function**：运行时原生实现，在 `meta-builtin.meta` 中用 `(declare-primitive-function name arity)` 声明
- **Derived function**：用 meta-lisp 自身实现，源代码在 `meta-builtin.meta/src/` 中

内置函数通过 `builtin/` 前缀访问（如 `(builtin/string-length "hello")`），但通常直接使用名字就够了（因为 builtin 模块默认在作用域中）。

## 基础类型

### bool

```scheme
bool-t                          ;; 类型：type-t
true                            ;; 值：bool-t
false                           ;; 值：bool-t
(bool? x)                       ;; (-> A bool-t)                    是否为布尔值
(not b)                         ;; (-> bool-t bool-t)               逻辑非
```

### int

```scheme
int-t                           ;; 类型：type-t
(int? x)                        ;; (-> A bool-t)                    是否为整数
(int-positive? x)               ;; (-> int-t bool-t)                是否为正数
(int-non-negative? x)           ;; (-> int-t bool-t)                是否为非负数
(int-non-zero? x)               ;; (-> int-t bool-t)                是否非零
(ineg x)                        ;; (-> int-t int-t)                 取负
(iadd x y)                      ;; (-> int-t int-t int-t)           加法
(isub x y)                      ;; (-> int-t int-t int-t)           减法
(imul x y)                      ;; (-> int-t int-t int-t)           乘法
(idiv x y)                      ;; (-> int-t int-t int-t)           整数除法
(imod x y)                      ;; (-> int-t int-t int-t)           取模
(int-max x y)                   ;; (-> int-t int-t int-t)           最大值
(int-min x y)                   ;; (-> int-t int-t int-t)           最小值
(int-greater? x y)              ;; (-> int-t int-t bool-t)          大于
(int-less? x y)                 ;; (-> int-t int-t bool-t)          小于
(int-greater-or-equal? x y)     ;; (-> int-t int-t bool-t)          大于等于
(int-less-or-equal? x y)        ;; (-> int-t int-t bool-t)          小于等于
(int-compare-ascending x y)     ;; (-> int-t int-t int-t)           升序比较（返回 -1/0/1）
(int-compare-descending x y)    ;; (-> int-t int-t int-t)           降序比较（返回 -1/0/1）
```

派生函数：

```scheme
(int-align n alignment)         ;; (-> int-t int-t int-t)           对齐
(int-sum xs)                    ;; (-> (list-t int-t) int-t)        求和
(int-product xs)                ;; (-> (list-t int-t) int-t)        求积
```

### float

```scheme
float-t                         ;; 类型：type-t
(float? x)                      ;; (-> A bool-t)                    是否为浮点数
(float-positive? x)             ;; (-> float-t bool-t)              是否为正数
(float-non-negative? x)         ;; (-> float-t bool-t)              是否为非负数
(float-non-zero? x)             ;; (-> float-t bool-t)              是否非零
(fneg x)                        ;; (-> float-t float-t)             取负
(fadd x y)                      ;; (-> float-t float-t float-t)     加法
(fsub x y)                      ;; (-> float-t float-t float-t)     减法
(fmul x y)                      ;; (-> float-t float-t float-t)     乘法
(fdiv x y)                      ;; (-> float-t float-t float-t)     除法
(fmod x y)                      ;; (-> float-t float-t float-t)     取模
(float-max x y)                 ;; (-> float-t float-t float-t)     最大值
(float-min x y)                 ;; (-> float-t float-t float-t)     最小值
(float-greater? x y)            ;; (-> float-t float-t bool-t)      大于
(float-less? x y)               ;; (-> float-t float-t bool-t)      小于
(float-greater-or-equal? x y)   ;; (-> float-t float-t bool-t)      大于等于
(float-less-or-equal? x y)      ;; (-> float-t float-t bool-t)      小于等于
(float-compare-ascending x y)   ;; (-> float-t float-t int-t)       升序比较
(float-compare-descending x y)  ;; (-> float-t float-t int-t)       降序比较
```

派生函数：

```scheme
(float-sum xs)                  ;; (-> (list-t float-t) float-t)    求和
(float-product xs)              ;; (-> (list-t float-t) float-t)    求积
```

### string

```scheme
string-t                        ;; 类型：type-t
(string? x)                     ;; (-> A bool-t)                    是否为字符串
(string-length s)               ;; (-> string-t int-t)              长度
(string-empty? s)               ;; (-> string-t bool-t)             是否为空
(string-blank? s)               ;; (-> string-t bool-t)             是否为空白
(string-substring start end s)  ;; (-> int-t int-t string-t string-t) 子串
(string-append a b)             ;; (-> string-t string-t string-t)  拼接两个
(string-concat strs)            ;; (-> (list-t string-t) string-t)  拼接列表
(string-compare-lexical a b)    ;; (-> string-t string-t int-t)     字典序比较
(string-to-symbol s)            ;; (-> string-t symbol-t)           转符号
(string-chars s)                ;; (-> string-t (list-t string-t))  拆分为单个字符的列表
(string-lines s)                ;; (-> string-t (list-t string-t))  按行拆分
(string-split s sep)            ;; (-> string-t string-t (list-t string-t)) 按分隔符拆分
(string-join sep strs)          ;; (-> string-t (list-t string-t) string-t) 用分隔符连接
(string-replace s old new)      ;; (-> string-t string-t string-t string-t) 替换
(string-starts-with? s prefix)  ;; (-> string-t string-t bool-t)    是否以 prefix 开头
(string-ends-with? s suffix)    ;; (-> string-t string-t bool-t)    是否以 suffix 结尾
(string-to-upper-case s)        ;; (-> string-t string-t)           转大写
(string-to-lower-case s)        ;; (-> string-t string-t)           转小写
(string-get-code-point i s)     ;; (-> int-t string-t int-t)        获取第 i 个字符的 code point
(string-contains? s sub)        ;; (-> string-t string-t bool-t)    是否包含子串
(string-find-index s sub)       ;; (-> string-t string-t int-t)     查找子串位置
(string-trim-left s)            ;; (-> string-t string-t)           删除左侧空白
(string-trim-right s)           ;; (-> string-t string-t)           删除右侧空白
(string-trim-start s)           ;; (-> string-t string-t)           删除开头空白
(string-trim-end s)             ;; (-> string-t string-t)           删除结尾空白
(string-trim s)                 ;; (-> string-t string-t)           删除两端空白
(string-int? s)                 ;; (-> string-t bool-t)             是否为整数格式
(string-float? s)               ;; (-> string-t bool-t)             是否为浮点数格式
(string-to-int s)               ;; (-> string-t int-t)              字符串转整数
(string-to-float s)             ;; (-> string-t float-t)            字符串转浮点数
```

派生函数：

```scheme
(string-repeat n s)             ;; (-> int-t string-t string-t)     重复字符串 n 次
```

### symbol

```scheme
symbol-t                        ;; 类型：type-t
(symbol? x)                     ;; (-> A bool-t)                    是否为符号
(symbol-length sym)             ;; (-> symbol-t int-t)              长度
(symbol-to-string sym)          ;; (-> symbol-t string-t)           转字符串
(symbol-append a b)             ;; (-> symbol-t symbol-t symbol-t)  拼接
(symbol-concat syms)            ;; (-> (list-t symbol-t) symbol-t)  拼接列表
```

### keyword

```scheme
keyword-t                       ;; 类型：type-t
(keyword? x)                    ;; (-> A bool-t)                    是否为关键字
(keyword-length kw)             ;; (-> keyword-t int-t)             长度
(keyword-to-string kw)          ;; (-> keyword-t string-t)          转字符串
(keyword-append a b)            ;; (-> keyword-t keyword-t keyword-t) 拼接
(keyword-concat kws)            ;; (-> (list-t keyword-t) keyword-t) 拼接列表
```

### void

```scheme
void-t                          ;; 类型：type-t
void                            ;; 值：void-t
(void? x)                       ;; (-> A bool-t)                    是否为 void
```

## 复合类型

### list

```scheme
(list-t E)                      ;; (-> type-t type-t)               类型构造器
(list? x)                       ;; (-> A bool-t)                    是否为列表
(make-list)                     ;; (-> (list-t E))                  创建空列表
(car xs)                        ;; (-> (list-t E) E)               取第一个元素
(cdr xs)                        ;; (-> (list-t E) (list-t E))      取剩余列表
(cons x xs)                     ;; (-> E (list-t E) (list-t E))    在头部插入
(list-head xs)                  ;; (-> (list-t E) E)               取第一个元素（同 car）
(list-tail xs)                  ;; (-> (list-t E) (list-t E))      取剩余列表（同 cdr）
(list-init xs)                  ;; (-> (list-t E) (list-t E))      取除最后一个外的列表
(list-last xs)                  ;; (-> (list-t E) E)               取最后一个元素
(list-length xs)                ;; (-> (list-t E) int-t)           长度
(list-empty? xs)                ;; (-> (list-t E) bool-t)          是否为空
(list-copy xs)                  ;; (-> (list-t E) (list-t E))      复制
(list-get i xs)                 ;; (-> int-t (list-t E) E)         按索引获取
(list-put i x xs)               ;; (-> int-t E (list-t E) (list-t E)) 按索引设置（返回新列表）
(list-push x xs)                ;; (-> E (list-t E) (list-t E))    尾部插入
(list-reverse xs)               ;; (-> (list-t E) (list-t E))      反转
(list-to-set xs)                ;; (-> (list-t E) (set-t E))       列表转集合
```

有 `!` 后缀的表示可能修改原列表：

```scheme
(list-put! i x xs)              ;; 同 list-put
(list-push! x xs)               ;; 同 list-push
(list-pop! xs)                  ;; (-> (list-t E) E)               弹出尾部元素
(list-pop-front! xs)            ;; (-> (list-t E) E)               弹出头部元素
(list-push-front! x xs)         ;; (-> E (list-t E) (list-t E))    头部插入
```

派生函数：

```scheme
(list-select pred xs)           ;; (-> (-> A bool-t) (list-t A) (list-t A))         筛选（保留匹配的）
(list-reject pred xs)           ;; (-> (-> A bool-t) (list-t A) (list-t A))         筛选（去除匹配的）
(list-find pred xs)             ;; (-> (-> A bool-t) (list-t A) (maybe-t A))        查找第一个匹配
(list-find-index pred xs)       ;; (-> (-> A bool-t) (list-t A) int-t)              查找索引
(list-map f xs)                 ;; (-> (-> A B) (list-t A) (list-t B))              映射
(list-map-zip f xs ys)          ;; (-> (-> A B C) (list-t A) (list-t B) (list-t C)) 双列表映射
(list-zip xs ys)                ;; (-> (list-t A) (list-t B) (list-t (pair-t A B))) 拉链
(list-unzip xys)                ;; (-> (list-t (pair-t A B)) (pair-t (list-t A) (list-t B))) 解拉链
(list-member? x xs)             ;; (-> A (list-t A) bool-t)                          是否包含
(list-fold-left f init xs)      ;; (-> (-> R E R) R (list-t E) R)                    左折叠
(list-fold-right f init xs)     ;; (-> (-> E R R) R (list-t E) R)                    右折叠
(list-every? pred xs)           ;; (-> (-> A bool-t) (list-t A) bool-t)              全部满足？
(list-some? pred xs)            ;; (-> (-> A bool-t) (list-t A) bool-t)              有满足的？
(list-each f xs)                ;; (-> (-> A Any) (list-t A) void-t)                 遍历（副作用）
(list-take n xs)                ;; (-> int-t (list-t A) (list-t A))                  取前 n 个
(list-drop n xs)                ;; (-> int-t (list-t A) (list-t A))                  去掉前 n 个
(list-first xs)                 ;; 同 car
(list-second xs)                ;; 第二个元素
(list-third xs)                 ;; 第三个元素
(list-append xs ys)             ;; (-> (list-t A) (list-t A) (list-t A))             连接两个列表
(list-concat xss)               ;; (-> (list-t (list-t A)) (list-t A))               扁平化一层
(list-group key-fn vs)          ;; (-> (-> V K) (list-t V) (hash-t K (list-t V)))    按 key 分组
```

### set

```scheme
(set-t E)                       ;; (-> type-t type-t)               类型构造器
(make-set)                      ;; (-> (set-t E))                  创建空集合
(set-copy s)                    ;; (-> (set-t E) (set-t E))        复制
(set-size s)                    ;; (-> (set-t E) int-t)            大小
(set-empty? s)                  ;; (-> (set-t E) bool-t)           是否为空
(set-member? x s)               ;; (-> E (set-t E) bool-t)         是否包含
(set-subset? a b)               ;; (-> (set-t E) (set-t E) bool-t) 是否为子集
(set-to-list s)                 ;; (-> (set-t E) (list-t E))       转列表
(set-add x s)                   ;; (-> E (set-t E) (set-t E))      添加元素
(set-delete x s)                ;; (-> E (set-t E) (set-t E))      删除元素
(set-clear! s)                  ;; (-> (set-t E) (set-t E))        清空
(set-union a b)                 ;; (-> (set-t E) (set-t E) (set-t E)) 并集
(set-inter a b)                 ;; (-> (set-t E) (set-t E) (set-t E)) 交集
(set-difference a b)            ;; (-> (set-t E) (set-t E) (set-t E)) 差集
(set-disjoint? a b)             ;; (-> (set-t E) (set-t E) bool-t) 是否不相交
```

有 `!` 后缀的：

```scheme
(set-add! x s)                  ;; 同 set-add
(set-delete! x s)               ;; 同 set-delete
```

派生函数：

```scheme
(set-select pred s)             ;; (-> (-> A bool-t) (set-t A) (set-t A))         筛选
(set-reject pred s)             ;; (-> (-> A bool-t) (set-t A) (set-t A))         反选
(set-each f s)                  ;; (-> (-> A Any) (set-t A) void-t)                遍历
(set-every? pred s)             ;; (-> (-> A bool-t) (set-t A) bool-t)             全部满足？
(set-some? pred s)              ;; (-> (-> A bool-t) (set-t A) bool-t)             有满足的？
(set-map f s)                   ;; (-> (-> A B) (set-t A) (set-t B))              映射
```

### hash

```scheme
(hash-t K V)                    ;; (-> type-t type-t type-t)          类型构造器
(make-hash)                     ;; (-> (hash-t K V))                 创建空 hash
(hash-empty? h)                 ;; (-> (hash-t K V) bool-t)          是否为空
(hash-length h)                 ;; (-> (hash-t K V) int-t)           键值对数量
(hash-get k h)                  ;; (-> K (hash-t K V) V)             获取值（不存在时报错）
(hash-has? k h)                 ;; (-> K (hash-t K V) bool-t)        是否包含键
(hash-put k v h)                ;; (-> K V (hash-t K V) (hash-t K V)) 设置键值对
(hash-delete! k h)              ;; (-> K (hash-t K V) (hash-t K V))  删除键
(hash-copy h)                   ;; (-> (hash-t K V) (hash-t K V))    复制
(hash-entries h)                ;; (-> (hash-t K V) (list-t (hash-entry-t K V))) 所有 entry
(hash-keys h)                   ;; (-> (hash-t K V) (list-t K))      所有键
(hash-values h)                 ;; (-> (hash-t K V) (list-t V))      所有值
```

有 `!` 后缀的：

```scheme
(hash-put! k v h)               ;; 同 hash-put
```

数据结构：

```scheme
;; hash-entry-t：hash 中的键值对
(hash-entry-t K V)              ;; 结构体：key + value
(make-hash-entry k v)           ;; 构造
(hash-entry-key entry)          ;; 取键
(hash-entry-value entry)        ;; 取值
```

派生函数：

```scheme
(hash-select pred h)            ;; (-> (-> K V bool-t) (hash-t K V) (hash-t K V))          筛选 entry
(hash-select-key pred h)        ;; (-> (-> K bool-t) (hash-t K V) (hash-t K V))             筛选键
(hash-select-value pred h)      ;; (-> (-> V bool-t) (hash-t K V) (hash-t K V))             筛选值
(hash-reject pred h)            ;; (-> (-> K V bool-t) (hash-t K V) (hash-t K V))          反选
(hash-put-entry entry h)        ;; 放入 entry 对象
(hash-map-key f h)              ;; (-> (-> K1 K2) (hash-t K1 V) (hash-t K2 V))             映射键
(hash-map-value f h)            ;; (-> (-> V1 V2) (hash-t K V1) (hash-t K V2))             映射值
(hash-map-entry f h)            ;; (-> (-> (hash-entry-t K1 V1) (hash-entry-t K2 V2)) ...)  映射 entry
(hash-map f h)                  ;; (-> (-> K1 V1 (hash-entry-t K2 V2)) ...)                 映射（接收 k v）
(hash-each-value f h)           ;; (-> (-> V Any) (hash-t K V) void-t)                       遍历值
(hash-each-key f h)             ;; (-> (-> K Any) (hash-t K V) void-t)                       遍历键
(hash-each-entry f h)           ;; (-> (-> (hash-entry-t K V) Any) (hash-t K V) void-t)      遍历 entry
(hash-each f h)                 ;; (-> (-> K V Any) (hash-t K V) void-t)                     遍历（接收 k v）
(hash-get-maybe k h)            ;; (-> K (hash-t K V) (maybe-t V))                           安全取值
(hash-invert h)                 ;; (-> (hash-t K V) (hash-t V K))                            反转（值变键）
(hash-invert-group h)           ;; (-> (hash-t K V) (hash-t V (set-t K)))                     反转分组
(hash-append a b)               ;; (-> (hash-t K V) (hash-t K V) (hash-t K V))               合并
(hash-from-entries entries)     ;; (-> (list-t (hash-entry-t K V)) (hash-t K V))             从 entry 列表构建
(hash-put-entries entries h)    ;; 从 entry 列表批量放入
```

## 通用值操作

```scheme
value                          ;; (module builtin)

(atom? x)                      ;; (-> A bool-t)                    是否为原子（非列表）
(same? a b)                    ;; (-> A B bool-t)                  是否完全同一引用
(equal? a b)                   ;; (-> A B bool-t)                  是否结构相等
(format x)                     ;; (-> A string-t)                  格式化为字符串
(hash-code x)                  ;; (-> A int-t)                    哈希码
(total-compare a b)            ;; (-> A B int-t)                  全序比较
```

## 数据结构

### pair

```scheme
(pair-t A B)                   ;; 结构体：first + second
(make-pair a b)                ;; 构造
(pair-first p)                 ;; 取第一个
(pair-second p)                ;; 取第二个
(pair-put-first! p x)          ;; 设置第一个
(pair-put-second! p x)         ;; 设置第二个
```

### maybe

```scheme
(maybe-t A)                    ;; 枚举：just / nothing
(just value)                   ;; 构造 just
(nothing)                      ;; 构造 nothing
(just? m)                      ;; 是否为 just
(nothing? m)                   ;; 是否为 nothing
(just-value m)                 ;; 取出值
```

## 文件和 I/O

### file

```scheme
file-t                          ;; 类型：type-t
(open-input-file path)          ;; (-> string-t file-t)             打开输入文件
(open-output-file path)         ;; (-> string-t file-t)             打开输出文件
(file-close f)                  ;; (-> file-t void-t)               关闭文件
(file-read f)                   ;; (-> file-t string-t)             读取全部内容
(file-write f s)                ;; (-> file-t string-t void-t)      写入字符串
(file-writeln f s)              ;; (-> file-t string-t void-t)      写入字符串并换行
(print x)                       ;; (-> A void-t)                   输出（不换行）
(println x)                     ;; (-> A void-t)                   输出并换行
(write s)                       ;; (-> string-t void-t)            写入字符串
(writeln s)                     ;; (-> string-t void-t)            写入字符串并换行
(newline)                       ;; (-> void-t)                     输出换行
```

派生函数：

```scheme
(call-with-input-file path f)   ;; (-> string-t (-> file-t A) A)   打开、调用、自动关闭
(call-with-output-file path f)  ;; (-> string-t (-> file-t A) A)   同上（写模式）
```

### fs（文件系统操作）

```scheme
(fs-exists? path)               ;; (-> string-t bool-t)            是否存在
(fs-file? path)                 ;; (-> string-t bool-t)            是否为文件
(fs-directory? path)            ;; (-> string-t bool-t)            是否为目录
(fs-read path)                  ;; (-> string-t string-t)          读取文件内容
(fs-write path content)         ;; (-> string-t string-t void-t)   写入文件
(fs-list path)                  ;; (-> string-t (list-t string-t)) 列出目录内容
(fs-list-recursive path)        ;; (-> string-t (list-t string-t)) 递归列出
(fs-ensure-file path)           ;; (-> string-t void-t)            确保文件存在
(fs-ensure-directory path)      ;; (-> string-t void-t)            确保目录存在
(fs-delete-file path)           ;; (-> string-t void-t)            删除文件
(fs-delete-directory path)      ;; (-> string-t void-t)            删除目录
(fs-delete path)                ;; (-> string-t void-t)            删除（自动判断文件/目录）
(fs-rename old new)             ;; (-> string-t string-t void-t)   重命名
```

### path

```scheme
(path-base-name path)           ;; (-> string-t string-t)           取文件名部分
(path-directory-name path)      ;; (-> string-t string-t)           取目录部分
(path-extension path)           ;; (-> string-t string-t)           取扩展名
(path-stem path)                ;; (-> string-t string-t)           取无扩展名的文件名
(path-absolute? path)           ;; (-> string-t bool-t)             是否为绝对路径
(path-relative? path)           ;; (-> string-t bool-t)             是否为相对路径
(path-join a b)                 ;; (-> string-t string-t string-t)  拼接路径
(path-normalize path)           ;; (-> string-t string-t)           标准化路径
```

## 测试与断言

```scheme
(assert cond)                   ;; (-> bool-t void-t)               断言为真
(assert-not cond)               ;; (-> bool-t void-t)               断言为假
(assert-equal expected actual)  ;; (-> A B void-t)                 断言相等
(assert-not-equal a b)          ;; (-> A B void-t)                 断言不相等
```

带 source location 的版本（测试框架内部使用）：

```scheme
(assert-with-location cond loc)
(assert-equal-with-location expected actual loc)
```

## 错误处理

```scheme
(error message)                 ;; (-> A B)                        抛出错误
(error-with-location message loc) ;; (-> A source-location-t B)    带位置的错误
```

## S-expression 解析

```scheme
(parse-located-sexps path content)  ;; (-> string-t string-t (list-t located-sexp-t)) 解析 S-expression
(format-sexp x)                     ;; (-> A string-t)                             格式化为 S-expression

;; 数据类型
(located-sexp-t)                 ;; 枚举：symbol-sexp / keyword-sexp / string-sexp / int-sexp / float-sexp / list-sexp
(source-location-t)              ;; 结构体：path + span
(source-span-t)                  ;; 结构体：start + end（source-position-t）
(source-position-t)              ;; 结构体：index + row + column
```

## 进程

```scheme
(exit code)                     ;; (-> int-t void-t)               退出进程
(current-directory)             ;; (-> string-t)                   当前工作目录
```

## 随机数

```scheme
(random-int min max)            ;; (-> int-t int-t int-t)          随机整数 [min, max)
(random-float min max)          ;; (-> float-t float-t float-t)    随机浮点数 [min, max)
```

## 函数工具（派生）

```scheme
(identity x)                    ;; (-> A A)                        恒等函数
(constant x)                    ;; (-> A B A)                      常量函数
(swap f)                        ;; (-> (-> A B C) (-> B A C))     交换参数顺序
(drop f)                        ;; (-> (-> A B) (-> C A B))       丢弃首个参数
(dup f)                         ;; (-> (-> A A B) (-> A B))       复制首个参数
```
