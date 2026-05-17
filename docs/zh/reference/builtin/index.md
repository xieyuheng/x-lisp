---
title: builtin 函数索引
---

# builtin 函数索引

meta-lisp 的所有内置函数按功能分类索引。

- [通用函数](#通用函数)
- [布尔值](#布尔值)
- [整数](#整数)
- [浮点数](#浮点数)
- [字符串](#字符串)
- [符号](#符号)
- [关键字](#关键字)
- [void](#void)
- [列表](#列表)
- [集合](#集合)
- [哈希表](#哈希表)
- [pair](#pair)
- [maybe](#maybe)
- [box](#box)
- [函数操作](#函数操作)
- [文件 I/O](#文件-io)
- [文件系统](#文件系统)
- [路径操作](#路径操作)
- [断言](#断言)
- [错误处理](#错误处理)
- [进程](#进程)
- [随机数](#随机数)
- [S 表达式](#s-表达式)
- [类型](#类型)

## 通用函数

对所有类型适用的通用操作。

- [`atom?`](value/atom?.md) — 判断是否为原子值
- [`same?`](value/same?.md) — 引用相等判断
- [`equal?`](value/equal?.md) — 结构相等判断
- [`format`](value/format.md) — 任意值格式化为字符串
- [`hash-code`](value/hash-code.md) — 计算哈希码
- [`total-compare`](value/total-compare.md) — 全序比较

## 布尔值

布尔类型 `bool-t` 上的操作。

- [`bool?`](bool/bool?.md) — 判断是否为布尔值
- [`not`](bool/not.md) — 逻辑非

## 整数

整数类型 `int-t` 上的操作。

### 类型判断

- [`int?`](int/int?.md) — 判断是否为整数

### 算术运算

- [`ineg`](int/ineg.md) — 取负
- [`iadd`](int/iadd.md) — 加法
- [`isub`](int/isub.md) — 减法
- [`imul`](int/imul.md) — 乘法
- [`idiv`](int/idiv.md) — 整除
- [`imod`](int/imod.md) — 取模

### 谓词

- [`int-positive?`](int/int-positive?.md) — 是否为正数
- [`int-non-negative?`](int/int-non-negative?.md) — 是否为非负数
- [`int-non-zero?`](int/int-non-zero?.md) — 是否非零

### 比较

- [`int-less?`](int/int-less?.md) — 小于
- [`int-greater?`](int/int-greater?.md) — 大于
- [`int-less-or-equal?`](int/int-less-or-equal?.md) — 小于等于
- [`int-greater-or-equal?`](int/int-greater-or-equal?.md) — 大于等于
- [`int-compare-ascending`](int/int-compare-ascending.md) — 升序比较函数
- [`int-compare-descending`](int/int-compare-descending.md) — 降序比较函数

### 极值

- [`int-min`](int/int-min.md) — 取较小值
- [`int-max`](int/int-max.md) — 取较大值

### 派生函数

- [`int-sum`](int/int-sum.md) — 列表求和
- [`int-product`](int/int-product.md) — 列表求积
- [`int-align`](int/int-align.md) — 对齐到倍数

## 浮点数

浮点数类型 `float-t` 上的操作。

### 类型判断

- [`float?`](float/float?.md) — 判断是否为浮点数

### 算术运算

- [`fneg`](float/fneg.md) — 取负
- [`fadd`](float/fadd.md) — 加法
- [`fsub`](float/fsub.md) — 减法
- [`fmul`](float/fmul.md) — 乘法
- [`fdiv`](float/fdiv.md) — 除法
- [`fmod`](float/fmod.md) — 取模

### 谓词

- [`float-positive?`](float/float-positive?.md) — 是否为正数
- [`float-non-negative?`](float/float-non-negative?.md) — 是否为非负数
- [`float-non-zero?`](float/float-non-zero?.md) — 是否非零

### 比较

- [`float-less?`](float/float-less?.md) — 小于
- [`float-greater?`](float/float-greater?.md) — 大于
- [`float-less-or-equal?`](float/float-less-or-equal?.md) — 小于等于
- [`float-greater-or-equal?`](float/float-greater-or-equal?.md) — 大于等于
- [`float-compare-ascending`](float/float-compare-ascending.md) — 升序比较函数
- [`float-compare-descending`](float/float-compare-descending.md) — 降序比较函数

### 极值

- [`float-min`](float/float-min.md) — 取较小值
- [`float-max`](float/float-max.md) — 取较大值

### 派生函数

- [`float-sum`](float/float-sum.md) — 列表求和
- [`float-product`](float/float-product.md) — 列表求积

## 字符串

字符串类型 `string-t` 上的操作。

### 类型判断

- [`string?`](string/string?.md) — 判断是否为字符串
- [`string-int?`](string/string-int?.md) — 是否为整数格式
- [`string-float?`](string/string-float?.md) — 是否为浮点数格式

### 基本操作

- [`string-length`](string/string-length.md) — 长度
- [`string-empty?`](string/string-empty?.md) — 是否为空串
- [`string-blank?`](string/string-blank?.md) — 是否为空白串

### 拼接与分割

- [`string-append`](string/string-append.md) — 拼接两个字符串
- [`string-concat`](string/string-concat.md) — 拼接字符串列表
- [`string-substring`](string/string-substring.md) — 取子串
- [`string-split`](string/string-split.md) — 按分隔符分割
- [`string-join`](string/string-join.md) — 用分隔符连接

### 查找与替换

- [`string-starts-with?`](string/string-starts-with?.md) — 是否以某串开头
- [`string-ends-with?`](string/string-ends-with?.md) — 是否以某串结尾
- [`string-contains?`](string/string-contains?.md) — 是否包含子串
- [`string-find-index`](string/string-find-index.md) — 查找子串位置
- [`string-replace`](string/string-replace.md) — 替换子串

### 修剪

- [`string-trim`](string/string-trim.md) — 修剪两端空白
- [`string-trim-start`](string/string-trim-start.md) — 修剪开头空白
- [`string-trim-end`](string/string-trim-end.md) — 修剪结尾空白
- [`string-trim-left`](string/string-trim-left.md) — 修剪左侧空白
- [`string-trim-right`](string/string-trim-right.md) — 修剪右侧空白

### 大小写转换

- [`string-to-lower-case`](string/string-to-lower-case.md) — 转小写
- [`string-to-upper-case`](string/string-to-upper-case.md) — 转大写

### 类型转换

- [`string-to-int`](string/string-to-int.md) — 字符串转整数
- [`string-to-float`](string/string-to-float.md) — 字符串转浮点数
- [`string-to-symbol`](string/string-to-symbol.md) — 字符串转符号

### 字符与码点

- [`string-chars`](string/string-chars.md) — 拆分为字符列表
- [`string-get-code-point`](string/string-get-code-point.md) — 取码点
- [`string-lines`](string/string-lines.md) — 按行分割

### 派生函数

- [`string-repeat`](string/string-repeat.md) — 重复字符串
- [`string-compare-lexical`](string/string-compare-lexical.md) — 字典序比较

## 符号

符号类型 `symbol-t` 上的操作。

- [`symbol?`](symbol/symbol?.md) — 判断是否为符号
- [`symbol-length`](symbol/symbol-length.md) — 符号名的长度
- [`symbol-append`](symbol/symbol-append.md) — 拼接两个符号
- [`symbol-concat`](symbol/symbol-concat.md) — 拼接符号列表
- [`symbol-to-string`](symbol/symbol-to-string.md) — 转字符串

## 关键字

关键字类型 `keyword-t` 上的操作。

- [`keyword?`](keyword/keyword?.md) — 判断是否为关键字
- [`keyword-length`](keyword/keyword-length.md) — 关键字名的长度
- [`keyword-append`](keyword/keyword-append.md) — 拼接两个关键字
- [`keyword-concat`](keyword/keyword-concat.md) — 拼接关键字列表
- [`keyword-to-string`](keyword/keyword-to-string.md) — 转字符串

## void

- [`void?`](void/void?.md) — 判断是否为 void 值

## 列表

列表类型 `(list-t E)` 上的操作。

### 类型与构造

- [`list-t`](list/list-t.md) — 列表类型构造器
- [`make-list`](list/make-list.md) — 创建空列表
- [`list?`](list/list?.md) — 判断是否为列表
- [`cons`](list/cons.md) — 在头部添加元素

### 访问

- [`car`](list/car.md) — 取第一个元素
- [`cdr`](list/cdr.md) — 取除第一个外的剩余列表
- [`list-head`](list/list-head.md) — 取第一个元素（同 `car`）
- [`list-tail`](list/list-tail.md) — 取剩余列表（同 `cdr`）
- [`list-first`](list/list-first.md) — 取第一个元素
- [`list-second`](list/list-second.md) — 取第二个元素
- [`list-third`](list/list-third.md) — 取第三个元素
- [`list-last`](list/list-last.md) — 取最后一个元素
- [`list-init`](list/list-init.md) — 取除最后一个外的所有元素
- [`list-get`](list/list-get.md) — 按索引取元素

### 信息

- [`list-length`](list/list-length.md) — 列表长度
- [`list-empty?`](list/list-empty?.md) — 是否为空列表
- [`list-member?`](list/list-member?.md) — 是否包含某元素

### 修改

- [`list-copy`](list/list-copy.md) — 复制列表
- [`list-put`](list/list-put.md) — 按索引替换元素（不可变）
- [`list-put!`](list/list-put!.md) — 按索引替换元素（可变）
- [`list-push`](list/list-push.md) — 尾部追加（不可变）
- [`list-push!`](list/list-push!.md) — 尾部追加（可变）
- [`list-push-front!`](list/list-push-front!.md) — 头部添加（可变）
- [`list-pop!`](list/list-pop!.md) — 弹出尾部元素（可变）
- [`list-pop-front!`](list/list-pop-front!.md) — 弹出头部元素（可变）

### 变换

- [`list-reverse`](list/list-reverse.md) — 反转
- [`list-to-set`](list/list-to-set.md) — 转集合

### 遍历与映射

- [`list-each`](list/list-each.md) — 遍历执行副作用
- [`list-flat-map`](list/list-flat-map.md) — 映射并扁平化
- [`list-map`](list/list-map.md) — 映射
- [`list-map-zip`](list/list-map-zip.md) — 同时映射两个列表
- [`list-zip`](list/list-zip.md) — 按位置配对
- [`list-unzip`](list/list-unzip.md) — 解配对
- [`list-select`](list/list-select.md) — 筛选（保留满足条件的）
- [`list-reject`](list/list-reject.md) — 反筛选（移除满足条件的）

### 折叠

- [`list-fold-left`](list/list-fold-left.md) — 左折叠
- [`list-fold-right`](list/list-fold-right.md) — 右折叠

### 量化

- [`list-every?`](list/list-every?.md) — 所有元素满足条件
- [`list-some?`](list/list-some?.md) — 存在元素满足条件

### 子列表

- [`list-take`](list/list-take.md) — 取前 n 个元素
- [`list-drop`](list/list-drop.md) — 去掉前 n 个元素
- [`list-append`](list/list-append.md) — 拼接两个列表
- [`list-concat`](list/list-concat.md) — 拼接列表的列表

### 分组与查找

- [`list-group`](list/list-group.md) — 按条件分组
- [`list-find`](list/list-find.md) — 查找第一个满足条件的元素
- [`list-find-index`](list/list-find-index.md) — 查找第一个满足条件的索引

## 集合

集合类型 `(set-t E)` 上的操作。

### 类型与构造

- [`set-t`](set/set-t.md) — 集合类型构造器
- [`make-set`](set/make-set.md) — 从列表创建集合

### 信息

- [`set-size`](set/set-size.md) — 大小
- [`set-empty?`](set/set-empty?.md) — 是否为空集
- [`set-member?`](set/set-member?.md) — 是否包含某元素
- [`set-subset?`](set/set-subset?.md) — 是否为子集

### 修改

- [`set-copy`](set/set-copy.md) — 复制集合
- [`set-add`](set/set-add.md) — 添加元素（不可变）
- [`set-add!`](set/set-add!.md) — 添加元素（可变）
- [`set-delete`](set/set-delete.md) — 删除元素（不可变）
- [`set-delete!`](set/set-delete!.md) — 删除元素（可变）
- [`set-clear!`](set/set-clear!.md) — 清空集合（可变）

### 集合运算

- [`set-union`](set/set-union.md) — 并集
- [`set-inter`](set/set-inter.md) — 交集
- [`set-difference`](set/set-difference.md) — 差集
- [`set-disjoint?`](set/set-disjoint?.md) — 是否不相交

### 遍历与变换

- [`set-each`](set/set-each.md) — 遍历执行副作用
- [`set-every?`](set/set-every?.md) — 所有元素满足条件
- [`set-some?`](set/set-some?.md) — 存在元素满足条件
- [`set-map`](set/set-map.md) — 映射
- [`set-select`](set/set-select.md) — 筛选
- [`set-reject`](set/set-reject.md) — 反筛选
- [`set-to-list`](set/set-to-list.md) — 转列表

## 哈希表

哈希表类型 `(hash-t K V)` 上的操作。

### 类型与构造

- [`hash-t`](hash/hash-t.md) — 哈希表类型构造器
- [`make-hash`](hash/make-hash.md) — 创建空哈希表
- [`hash-entry-t`](hash/hash-entry-t.md) — 条目类型构造器
- [`make-hash-entry`](hash/make-hash-entry.md) — 构造条目
- [`hash-entry-key`](hash/hash-entry-key.md) — 条目的键访问器
- [`hash-entry-value`](hash/hash-entry-value.md) — 条目的值访问器
- [`hash-from-entries`](hash/hash-from-entries.md) — 从条目列表构建哈希表

### 信息

- [`hash-empty?`](hash/hash-empty?.md) — 是否为空
- [`hash-length`](hash/hash-length.md) — 条目数
- [`hash-has?`](hash/hash-has?.md) — 是否包含某键

### 访问

- [`hash-get`](hash/hash-get.md) — 按键取值
- [`hash-get-maybe`](hash/hash-get-maybe.md) — 取可选值

### 转换

- [`hash-keys`](hash/hash-keys.md) — 取所有键
- [`hash-values`](hash/hash-values.md) — 取所有值
- [`hash-entries`](hash/hash-entries.md) — 取所有条目

### 修改

- [`hash-put`](hash/hash-put.md) — 添加键值对（不可变）
- [`hash-put!`](hash/hash-put!.md) — 添加键值对（可变）
- [`hash-put-entries`](hash/hash-put-entries.md) — 批量放入条目（不可变）
- [`hash-put-entries!`](hash/hash-put-entries!.md) — 批量放入条目（可变）
- [`hash-delete!`](hash/hash-delete!.md) — 按键删除（可变）
- [`hash-copy`](hash/hash-copy.md) — 复制哈希表

### 遍历

- [`hash-each`](hash/hash-each.md) — 遍历键值对
- [`hash-each-key`](hash/hash-each-key.md) — 遍历键
- [`hash-each-value`](hash/hash-each-value.md) — 遍历值
- [`hash-each-entry`](hash/hash-each-entry.md) — 遍历条目

### 映射

- [`hash-map`](hash/hash-map.md) — 映射键值对
- [`hash-map-key`](hash/hash-map-key.md) — 映射键
- [`hash-map-value`](hash/hash-map-value.md) — 映射值
- [`hash-map-entry`](hash/hash-map-entry.md) — 映射条目

### 筛选

- [`hash-select`](hash/hash-select.md) — 按键值谓词筛选
- [`hash-select-key`](hash/hash-select-key.md) — 按键谓词筛选
- [`hash-select-value`](hash/hash-select-value.md) — 按值谓词筛选
- [`hash-reject`](hash/hash-reject.md) — 按键值谓词移除
- [`hash-reject-key`](hash/hash-reject-key.md) — 按键谓词移除
- [`hash-reject-value`](hash/hash-reject-value.md) — 按值谓词移除

### 聚合

- [`hash-append`](hash/hash-append.md) — 合并两个哈希表
- [`hash-invert`](hash/hash-invert.md) — 键值互换
- [`hash-invert-group`](hash/hash-invert-group.md) — 键值互换并归组

## pair

pair 类型 `(pair-t A B)` 上的操作。

- [`pair-t`](pair/pair-t.md) — pair 类型构造器
- [`make-pair`](pair/make-pair.md) — 构造 pair
- [`pair?`](pair/pair?.md) — 判断是否为 pair
- [`pair-first`](pair/pair-first.md) — 取第一个元素
- [`pair-second`](pair/pair-second.md) — 取第二个元素
- [`pair-put-first!`](pair/pair-put-first!.md) — 替换第一个元素
- [`pair-put-second!`](pair/pair-put-second!.md) — 替换第二个元素

## maybe

maybe 类型 `(maybe-t A)` 上的操作。

- [`maybe-t`](maybe/maybe-t.md) — maybe 类型构造器
- [`just`](maybe/just.md) — 构造存在值
- [`nothing`](maybe/nothing.md) — 表示缺失值
- [`just?`](maybe/just?.md) — 判断是否为 just
- [`nothing?`](maybe/nothing?.md) — 判断是否为 nothing
- [`just-value`](maybe/just-value.md) — 提取 just 中的值
- [`just-put-value!`](maybe/just-put-value!.md) — 替换 just 中的值

## box

不透明类型 `(box-t E)` 上的操作。

- [`box-t`](box/box-t.md) — box 类型构造器
- [`make-box`](box/make-box.md) — 创建空 box
- [`box-empty?`](box/box-empty?.md) — 判断是否为空
- [`box-put!`](box/box-put!.md) — 存入值
- [`box-get-maybe`](box/box-get-maybe.md) — 取出可选值
- [`box-get`](box/box-get.md) — 取出值（空 box 时报错）

## 函数操作

高阶函数操作。

- [`constant`](function/constant.md) — 返回第一个参数
- [`identity`](function/identity.md) — 返回参数本身
- [`swap`](function/swap.md) — 交换函数参数顺序
- [`drop`](function/drop.md) — 忽略第一个参数
- [`dup`](function/dup.md) — 重复传入参数

## 文件 I/O

文件句柄相关的读写操作。

### 类型

- [`file-t`](file/file-t.md) — 文件句柄类型

### 打开与关闭

- [`open-input-file`](file/open-input-file.md) — 打开文件用于读取
- [`open-output-file`](file/open-output-file.md) — 打开文件用于写入
- [`file-close`](file/file-close.md) — 关闭文件

### 读写

- [`file-read`](file/file-read.md) — 读取文件全部内容
- [`file-write`](file/file-write.md) — 写入字符串
- [`file-writeln`](file/file-writeln.md) — 写入字符串并换行

### 便捷函数

- [`call-with-input-file`](file/call-with-input-file.md) — 自动关闭的读取
- [`call-with-output-file`](file/call-with-output-file.md) — 自动关闭的写入

### 标准输出

- [`print`](file/print.md) — 打印任意值
- [`println`](file/println.md) — 打印任意值并换行
- [`write`](file/write.md) — 写入字符串
- [`writeln`](file/writeln.md) — 写入字符串并换行
- [`newline`](file/newline.md) — 打印换行符
- [`current-stdout-file`](file/current-stdout-file.md) — 获取当前标准输出文件句柄
- [`current-stderr-file`](file/current-stderr-file.md) — 获取当前标准错误文件句柄

## 文件系统

直接操作文件系统的函数。

### 查询

- [`fs-exists?`](fs/fs-exists?.md) — 路径是否存在
- [`fs-file?`](fs/fs-file?.md) — 是否为文件
- [`fs-directory?`](fs/fs-directory?.md) — 是否为目录

### 读写

- [`fs-read`](fs/fs-read.md) — 读取文件
- [`fs-write`](fs/fs-write.md) — 写入文件

### 目录操作

- [`fs-list`](fs/fs-list.md) — 列出目录内容
- [`fs-list-recursive`](fs/fs-list-recursive.md) — 递归列出目录
- [`fs-ensure-file`](fs/fs-ensure-file.md) — 确保文件存在
- [`fs-ensure-directory`](fs/fs-ensure-directory.md) — 确保目录存在

### 删除与重命名

- [`fs-delete-file`](fs/fs-delete-file.md) — 删除文件
- [`fs-delete-directory`](fs/fs-delete-directory.md) — 删除空目录
- [`fs-delete`](fs/fs-delete.md) — 递归删除
- [`fs-rename`](fs/fs-rename.md) — 重命名

## 路径操作

路径字符串的处理函数。

- [`path-base-name`](path/path-base-name.md) — 取文件名部分
- [`path-directory-name`](path/path-directory-name.md) — 取目录部分
- [`path-extension`](path/path-extension.md) — 取扩展名
- [`path-stem`](path/path-stem.md) — 取主干名
- [`path-absolute?`](path/path-absolute?.md) — 是否为绝对路径
- [`path-relative?`](path/path-relative?.md) — 是否为相对路径
- [`path-join`](path/path-join.md) — 连接路径
- [`path-normalize`](path/path-normalize.md) — 标准化路径

## 断言

测试用的断言函数。

- [`assert`](assert/assert.md) — 断言为真
- [`assert-not`](assert/assert-not.md) — 断言为假
- [`assert-equal`](assert/assert-equal.md) — 断言相等
- [`assert-not-equal`](assert/assert-not-equal.md) — 断言不相等

## 错误处理

- [`error`](error/error.md) — 抛出错误

## 进程

- [`exit`](process/exit.md) — 以退出码退出
- [`current-directory`](process/current-directory.md) — 获取当前目录

## 随机数

- [`random-int`](random/random-int.md) — 随机整数
- [`random-float`](random/random-float.md) — 随机浮点数

## S 表达式

S 表达式的解析、格式化和相关类型。

### 类型

- [`sexp-t`](sexp/sexp-t.md) — 带位置的 S 表达式类型
- [`source-location-t`](sexp/source-location-t.md) — 源码位置类型
- [`source-span-t`](sexp/source-span-t.md) — 源码区间类型
- [`source-position-t`](sexp/source-position-t.md) — 源码坐标类型

### 操作

- [`parse-sexps`](sexp/parse-sexps.md) — 解析为带位置的 S 表达式
- [`format-sexp`](sexp/format-sexp.md) — 格式化 S 表达式
- [`sexp-collect-key-value-pairs`](sexp/sexp-collect-key-value-pairs.md) — 收集键值对列表
- [`sexp-collect-key-value-hash`](sexp/sexp-collect-key-value-hash.md) — 收集键值对哈希表


