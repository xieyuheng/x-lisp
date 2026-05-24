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

### File Header (28 bytes)

| offset | size | field             | description             |
|--------|------|-------------------|-------------------------|
| 0      | 4    | magic             | `0x58455845` ("XEXE")   |
| 4      | 4    | version           | `1`                     |
| 8      | 4    | def_count         | definition 数量         |
| 12     | 4    | strtab_size       | string table 字节数     |
| 16     | 4    | value_count       | value table 条目数      |
| 20     | 4    | def_reloc_count   | definition 重定位条目数 |
| 24     | 4    | value_reloc_count | value 重定位条目数      |

### Definition Table (def_count 条)

每条连续存储：

| size | field | description |
|---|---|---|
| 1 | kind | 0=function, 1=primitive, 2=variable |
| 4 | name_off | 指向 string table |
| 2 | arity | 参数数量（variable 始终为 0） |
| 1 | flags | bit0: is_test |
| *(仅 kind==0 或 kind==2)* | | |
| 2 | local_count | 局部变量数 |
| 4 | code_len | 字节码长度（kind==1 时不存储，code_len=0） |
| code_len | code | 原始字节码 |

注意：kind==1 (primitive) 不序列化（文件中不会出现）。
kind==2 (variable) 存储 function body 的 bytecode，
用于在加载时通过 xasm_setup 执行初始化。

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

### String Table

```
strtab: char[strtab_size]
```

所有名字和字符串内容统一存放，NUL 字符分隔。
各条目通过 offset 引用。

## Schema 描述

以下用 C struct 伪代码描述 `.xexe` 的二进制布局，
单个顶层 struct 展示文件整体轮廓，嵌套匿名 struct 描述各表。

```c
// 枚举定义
enum def_kind {
  DEF_FUNCTION   = 0,
  DEF_PRIMITIVE  = 1,
  DEF_VARIABLE   = 2,
};

enum value_kind {
  VALUE_KEYWORD  = 1,
  VALUE_STRING   = 2,
  VALUE_SYMBOL   = 3,
};

#define FLAG_IS_TEST 0x01

// 文件整体布局（顺序排列）
struct xexe_file {
    // ---- header (28 bytes) ----
    uint32_t magic;               // 0x58455845 ("XEXE")
    uint32_t version;             // 1
    uint32_t def_count;
    uint32_t strtab_size;
    uint32_t value_count;
    uint32_t def_reloc_count;
    uint32_t value_reloc_count;

    // ---- definition table (def_count 条) ----
    struct {
        uint8_t  kind;            // enum def_kind
        uint32_t name_off;
        uint16_t arity;
        uint8_t  flags;           // bit0: FLAG_IS_TEST
        // 当 kind == DEF_FUNCTION 或 DEF_VARIABLE 时，附加以下字段
        // (DEF_PRIMITIVE 不序列化，文件中不会出现)
        uint16_t local_count;     // 仅 kind == 0 或 2
        uint32_t code_len;        // 仅 kind == 0 或 2
        uint8_t  code[code_len];  // 仅 kind == 0 或 2，变长
    } definitions[def_count];     // 每条实际大小不固定

    // ---- value table (value_count 条) ----
    struct {
        uint8_t  kind;            // enum value_kind
        uint32_t data_off;
    } values[value_count];

    // ---- definition relocation table (def_reloc_count 条) ----
    struct {
        uint32_t def_index;       // 所属 definition 索引
        uint32_t offset;          // code 内字节偏移
        uint32_t target_off;      // 指向 strtab（被引用定义的名字）
    } def_relocs[def_reloc_count];

    // ---- value relocation table (value_reloc_count 条) ----
    struct {
        uint32_t def_index;       // 所属 definition 索引
        uint32_t offset;          // code 内字节偏移
        uint32_t value_index;     // value table 中的索引
    } value_relocs[value_reloc_count];

    // ---- string table ----
    char strtab[strtab_size];     // NUL 分隔的字符串池
};
```

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
2. 读 definition table → 解析每条 definition 的 header 与 bytecode
3. 读 value table → 解析每条 value entry
4. 读 def reloc table + value reloc table
5. strtab = 剩余 strtab_size 字节（文件末尾）
6. 创建 mod = make_mod(path)
7. import_builtin(mod) → 注册所有 C primitive function
   （此时 mod 中已有所有 builtin 的 definition）

8. 重建 value 对象：
   for each value entry:
     kind × data_off → 获取字符串
     keyword → x_object(intern_keyword(str))
     string  → x_object(make_xstring(str))
     symbol  → x_object(intern_symbol(str))
   结果存入 value_objects[] 数组

9. 创建 definition_t：
   for each definition entry:
     function:  创建 function_t + buffer_t，拷贝 bytecode
                mod_define(mod, name, def)
     primitive: 从 mod 中按 name 查找（已在步骤7注册）
                找不到则报错（未知的 primitive 引用）
     variable:  创建 variable definition 占位
                mod_define(mod, name, def)
     is_test:   若 flags bit0=1，set_add(mod->test_names, name)

10. Patch definition relocations：
    for each def reloc entry:
      def = mod->definitions[def_index] 的 function_t
      target_name = strtab[target_off]
      target_def = mod_lookup_or_fail(mod, target_name)
      将 &target_def (8 字节) 写入 def->code[offset]

11. Patch value relocations：
    for each value reloc entry:
      def = mod->definitions[def_index] 的 function_t
      value = value_objects[value_index]
      将 value (8 字节) 写入 def->code[offset]

12. xasm_setup(mod) → 执行所有 variable 的初始化 body
13. return mod
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

| 文件              | 内容                                   |
|-------------------|----------------------------------------|
| `types.h`         | 魔数、版本常量、kind enum、struct 定义 |
| `deps.h`          | 模块依赖                               |
| `index.h`         | include 所有头文件                     |
| `xexe_assemble.c` | mod → .xexe 序列化                    |
| `xexe_load.c`     | .xexe → mod 反序列化 + 重定位         |

### 修改文件

| 文件          | 改动                                                                 |
|---------------|----------------------------------------------------------------------|
| `xvm.exe.c`   | 增加 `assemble` 路由；`call`/`test` 根据扩展名选择加载方式           |
| `xasm/xasm.h` | 无改动，但 `xexe_load` 返回的 mod 与 `xasm_load` 返回的 mod 完全兼容 |

## 设计约束与后续扩展

### 约束

- OP_LOAD 的值仅支持 immediate（int/float/bool/void）和 keyword/string/symbol 对象。
  不支持 list/hash/set 等复合对象值。
- Variable definition 的 value 不序列化，通过 setup 阶段执行 body 来初始化。
- Primitive definition 不序列化（C 函数指针不可移植），加载时通过 `import_builtin` 注册后按名字查找。

### 扩展方向

- 支持跨文件引用（类似 .so/.dll 的动态链接）
