# .xexe 可执行文件格式设计

## 概述

`.xexe` 是 xvm 的预编译可执行文件格式。
将 `.xasm` 源码的解析和汇编结果序列化为二进制，
加载时无需重新解析 sexp 和汇编，只需反序列化 + 重定位即可执行。

## 当前架构回顾

### xasm 加载流程 (`xasm_load`)

```
.xasm → parse sexps → import_builtin → declare → prepare → assemble → setup → mod_t*
```

其中 `assemble` 将 sexp 编译为 function bytecode，存储在 `function_t->buffer` 中。

### bytecode 中嵌入的非可移植数据

| 指令 | 嵌入类型 | 在 code 中的位置 | 说明 |
|---|---|---|---|
| OP_CALL, OP_TAIL_CALL | `definition_t *` (8 字节) | pc + 1 | 指向目标定义的指针 |
| OP_REF, OP_GLOBAL_LOAD, OP_GLOBAL_STORE | `definition_t *` (8 字节) | pc + 3 | 指向目标定义的指针 |
| OP_LOAD | `value_t` (8 字节) | pc + 3 | 可能为 keyword/string/symbol 对象 |

## .xexe 二进制格式

所有整数均为 little-endian。

### File Header (20 bytes)

| offset | size | field | description |
|---|---|---|---|
| 0 | 4 | magic | `0x58455845` ("XEXE") |
| 4 | 4 | version | `1` |
| 8 | 4 | def_count | definition 数量 |
| 12 | 4 | strtab_size | string table 字节数 |
| 16 | 2 | value_count | value table 条目数 |
| 18 | 1 | def_reloc_count | definition 重定位条目数 |
| 19 | 1 | value_reloc_count | value 重定位条目数 |

注意：def_reloc_count 和 value_reloc_count 均为 uint8_t。
意味着当前版本每个 .xexe 最多 255 条重定位。
需要时可在 v2 扩展为 uint32。

### String Table

```
strtab: char[strtab_size]
```

所有名字和字符串内容统一存放，NUL 字符分隔。
各条目通过 offset 引用。

### Definition Table (def_count 条)

每条连续存储：

| size | field | description |
|---|---|---|
| 1 | kind | 0=function, 1=primitive, 2=variable |
| 4 | name_off | 指向 string table |
| 2 | arity | 参数数量 |
| 1 | flags | bit0: is_test |
| *(仅 kind==0)* | | |
| 2 | local_count | 局部变量数 |
| 4 | code_len | 字节码长度 |
| code_len | code | 原始字节码 |

### Value Table (value_count 条)

每条对应一个需要重定位的 value_t 对象（keyword / string / symbol）。

| size | field | description |
|---|---|---|
| 1 | kind | 1=keyword, 2=string, 3=symbol |
| 4 | data_off | 指向 string table（字符串内容） |

### Definition Relocation Table (def_reloc_count 条)

每条对应 bytecode 中的一个 `definition_t *` 指针位置。

| size | field | description |
|---|---|---|
| 4 | def_index | definition table 中的索引（所属 function） |
| 4 | offset | code 内的字节偏移，指向 8 字节指针 |
| 4 | target_off | 指向 string table（被引用定义的名字） |

### Value Relocation Table (value_reloc_count 条)

每条对应 bytecode 中的一个 value_t（X_OBJECT）位置。

| size | field | description |
|---|---|---|
| 4 | def_index | definition table 中的索引（所属 function） |
| 4 | offset | code 内的字节偏移，指向 value_t |
| 4 | value_index | value table 中的索引 |

## Schema 描述（补充）

以下用两种格式描述语言从不同角度描述 `.xexe` 的二进制布局。
均为文档用途，供人与 AI 阅读。

### Lisp DSL

自定义的二进制格式描述 DSL，以 meta-lisp 的 sexp 语法书写。

```lisp
(format xexe
  :endian le

  (def header
    (field magic             :u32 :const #x58455845)
    (field version           :u32 :const 1)
    (field def-count         :u32)
    (field strtab-size       :u32)
    (field value-count       :u16)
    (field def-reloc-count   :u8)
    (field value-reloc-count :u8))

  (def string-table
    (field strtab :bytes :size strtab-size))

  (def definition
    (field kind      :u8  :enum (function 0 primitive 1 variable 2))
    (field name-off  :u32)
    (field arity     :u16)
    (field flags     :u8)

    (when (= kind 0)
      (field local-count :u16)
      (field code-len    :u32)
      (field code        :bytes :size code-len)))

  (def definition-table
    (repeat def-count
      (field entry definition)))

  (def value
    (field kind     :u8  :enum (keyword 1 string 2 symbol 3))
    (field data-off :u32))

  (def value-table
    (repeat value-count
      (field entry value)))

  (def def-reloc
    (field def-index  :u32)
    (field offset     :u32)
    (field target-off :u32))

  (def def-reloc-table
    (repeat def-reloc-count
      (field entry def-reloc)))

  (def value-reloc
    (field def-index   :u32)
    (field offset      :u32)
    (field value-index :u32))

  (def value-reloc-table
    (repeat value-reloc-count
      (field entry value-reloc))))
```

语义说明：

| 构造 | 含义 | 示例 |
|---|---|---|
| `:const <v>` | 字段必须为此值 | `:const #x58455845` |
| `:enum (<sym> <val> ...)` | 枚举值约束 | `:enum (function 0 primitive 1 ...)` |
| `:size <expr>` | 可变长字段，长度引用于其他字段 | `:bytes :size code-len` |
| `(when <cond> <body>...)` | 仅当条件满足时该段存在 | `(when (= kind 0) ...)` |
| `(repeat <expr> <body>...)` | 根据计数字段的值重复结构 | `(repeat def-count ...)` |
| `(field entry <def>)` | 嵌入已定义的子结构 | `(field entry definition)` |

### Kaitai Struct

Kaitai Struct 是描述任意二进制格式的最成熟 DSL，可编译生成 10+ 语言的解析器。
以下用 Kaitai Struct 重新描述 `.xexe` 格式作为对照。

```yaml
# xexe.ksy
#
# 安装: pip install kaitai-struct-compiler
# 编译: kaitai-struct-compiler xexe.ksy -t cpp_stl --outdir .

meta:
  id: xexe
  title: xvm executable format
  endian: le
  license: CC0-1.0

seq:
  - id: magic
    contents: [0x58, 0x45, 0x58, 0x45]
  - id: version
    type: u4
  - id: def_count
    type: u4
  - id: strtab_size
    type: u4
  - id: value_count
    type: u2
  - id: def_reloc_count
    type: u1
  - id: value_reloc_count
    type: u1
  - id: definitions
    type: definition
    repeat: expr
    repeat-expr: def_count
  - id: values
    type: value_entry
    repeat: expr
    repeat-expr: value_count
  - id: def_relocs
    type: def_reloc
    repeat: expr
    repeat-expr: def_reloc_count
  - id: value_relocs
    type: value_reloc
    repeat: expr
    repeat-expr: value_reloc_count

types:
  definition:
    seq:
      - id: kind
        type: u1
        enum: def_kind
      - id: name_off
        type: u4
      - id: arity
        type: u2
      - id: flags
        type: u1
      - id: body
        type:
          switch-on: kind
          cases:
            "def_kind::function": definition_function_body
    instances:
      name:
        value: _root.strtab[name_off]
      is_test:
        value: flags & 1 != 0

  definition_function_body:
    seq:
      - id: local_count
        type: u2
      - id: code_len
        type: u4
      - id: code
        size: code_len

  value_entry:
    seq:
      - id: kind
        type: u1
        enum: value_kind
      - id: data_off
        type: u4
    instances:
      data:
        value: _root.strtab[data_off]

  def_reloc:
    seq:
      - id: def_index
        type: u4
      - id: offset
        type: u4
      - id: target_off
        type: u4
    instances:
      target_name:
        value: _root.strtab[target_off]

  value_reloc:
    seq:
      - id: def_index
        type: u4
      - id: offset
        type: u4
      - id: value_index
        type: u4

enums:
  def_kind:
    0: function
    1: primitive
    2: variable
  value_kind:
    1: keyword
    2: string
    3: symbol

instances:
  strtab:
    pos: _io.pos
    size: strtab_size
```

与 Lisp DSL 的对比：

| 维度 | Lisp DSL | Kaitai Struct |
|---|---|---|
| **范式** | 声明式 + sexp | 声明式 + YAML |
| **重复** | `(repeat <expr> ...)` | `repeat: expr` + `repeat-expr: <field>` |
| **条件字段** | `(when <cond> ...)` | `switch-on` + `cases` |
| **字段引用** | `:size <field>` | `size: field` + `instances` 计算属性 |
| **枚举** | 内联 `:enum` | 顶层 `enums:` 声明后引用 |
| **访问上层** | 隐式作用域 | 显式 `_root.field` |
| **工具链** | 无（文档用途） | 生成 12 种语言的解析器 |

## 编译流程 (`xexe_assemble`)

输入：已组装好的 `mod_t *`（即 `xasm_load` 的产物）。
输出：`.xexe` 文件。

```
1. 构建 string table：
   - 收集所有 definition 的名字、relocation target 名字
   - 收集所有 value（keyword/string/symbol）的内容字符串
   - 去重，合并为一个 NUL-separated 的 buffer
   
2. 遍历 mod->definitions，写 definition table：
   - function:  kind + name_off + arity + flags + local_count +
                code_len + raw bytecode
   - primitive: kind + name_off + arity + flags
   - variable:  kind + name_off + arity + flags
                （value 不存，在 setup 阶段动态初始化）

3. 扫描每个 function 的 bytecode：
   解码每条指令，定位到需要重定位的位置：
   
   - CALL / TAIL_CALL：
       定位到 pc + 1 处的 definition_t *
       → 写 def reloc entry
       指令长度 = 1 + 8 + 1 + argc * 2
       
   - REF / GLOBAL_LOAD / GLOBAL_STORE：
       定位到 pc + 3 处的 definition_t *
       → 写 def reloc entry
       
   - OP_LOAD：
       读取 pc + 3 处的 value_t
       → 若为 keyword_p / string_p / symbol_p：
         写 value table + value reloc entry
       → 若为 immediate (int/float/bool/void)：
         无需重定位，直接保留原值
         
4. 写入文件 header + 五张表 + string table
```

## 加载流程 (`xexe_load`)

输入：`.xexe` 文件路径。
输出：ready-to-use 的 `mod_t *`。

```
1. 读 header，验证 magic == "XEXE"，version == 1
2. 读 strtab_size 字节到内存
3. 创建 mod = make_mod(path)
4. import_builtin(mod) → 注册所有 C primitive function
   （此时 mod 中已有所有 builtin 的 definition）
   
5. 读 value table → 重建对象：
   for each value entry:
     kind × data_off → 获取字符串
     keyword → x_object(intern_keyword(str))
     string  → x_object(make_xstring(str))
     symbol  → x_object(intern_symbol(str))
   结果存入 value_objects[] 数组

6. 读 definition table → 创建 definition_t：
   for each definition entry:
     function:  创建 function_t + buffer_t，拷贝 bytecode
                mod_define(mod, name, def)
     primitive: 从 mod 中按 name 查找（已在步骤4注册）
                找不到则报错（未知的 primitive 引用）
     variable:  创建 variable definition 占位
                mod_define(mod, name, def)
     is_test:   若 flags bit0=1，set_add(mod->test_names, name)

7. Patch definition relocations：
   for each def reloc entry:
     def = mod->definitions[def_index] 的 function_t
     target_name = strtab[target_off]
     target_def = mod_lookup_or_fail(mod, target_name)
     将 &target_def (8 字节) 写入 def->code[offset]

8. Patch value relocations：
   for each value reloc entry:
     def = mod->definitions[def_index] 的 function_t
     value = value_objects[value_index]
     将 value (8 字节) 写入 def->code[offset]

9. xasm_setup(mod) → 执行所有 variable 的初始化 body
10. return mod
```

## 命令入口

```
xvm assemble <file.xasm> [-o <output.xexe>]
  将 .xasm 编译为 .xexe
  若未指定 -o，默认输出为 file.xexe

xvm call <file> <function> [args...]
  若 file 以 .xexe 结尾 → xexe_load + xasm_call
  否则                → xasm_load + xasm_call

xvm test <file> [--snapshot] [--profile] [--builtin]
  若 file 以 .xexe 结尾 → xexe_load + xasm_test
  否则                → xasm_load + xasm_test
```

## 所需修改的文件

### 新文件（`src/xexe/`）

| 文件 | 内容 |
|---|---|
| `types.h` | 魔数、版本常量、kind enum、struct 定义 |
| `deps.h` | 模块依赖 |
| `index.h` | include 所有头文件 |
| `xexe_assemble.c` | mod → .xexe 序列化 |
| `xexe_load.c` | .xexe → mod 反序列化 + 重定位 |

### 修改文件

| 文件 | 改动 |
|---|---|
| `xvm.exe.c` | 增加 `assemble` 路由；`call`/`test` 根据扩展名选择加载方式 |
| `xasm/xasm.h` | 无改动，但 `xexe_load` 返回的 mod 与 `xasm_load` 返回的 mod 完全兼容 |

## bytecode 扫描器

`xexe_assemble` 和 `xexe_load` 都需要解码每条指令以定位指针/value 位置。
需要写一个扫描器，输入 bytecode buffer，对每条指令调用 callback，
callback 的参数包括 opcode、位置和需要处理的 pointer/value。

该扫描器可抽取为 `xexe_code_walk()` 或在两个文件中各自 inline 实现。

## 设计约束与后续扩展

### v1 约束
- OP_LOAD 的值仅支持 immediate（int/float/bool/void）和 keyword/string/symbol 对象。
  不支持 list/hash/set 等复合对象值。
- Variable definition 的 value 不序列化，通过 setup 阶段执行 body 来初始化。
- Primitive definition 不序列化（C 函数指针不可移植），加载时通过 `import_builtin` 注册后按名字查找。
- 重定位条目数限制为每类型 255 条（uint8_t 字段），超过时报错。

### v2 扩展方向
- 扩大重定位条目数字段
- 对 variable 的 value 支持序列化
- 对 OP_LOAD 中的 list 等复合对象值支持序列化
- 支持跨文件引用（类似 .so/.dll 的动态链接）
