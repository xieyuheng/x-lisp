#pragma once

/*
 * __attribute__((format(printf, 2, 3))) 的含义：
 *
 * 这不是函数调用，而是一个 GCC/Clang 编译器属性。
 * 它告诉编译器：本函数带有类似 printf 的格式化参数，
 * 请按照 printf 的格式规则做编译期检查。
 *
 * 参数说明：
 *   format(archetype, string-index, first-to-check)
 *
 *   - printf      ：参照 printf 的格式规则，例如 %d、%s、%f
 *   - 2           ：第 2 个参数是格式字符串（即 template）
 *   - 3           ：从第 3 个参数开始检查可变参数是否与格式串匹配
 *
 * 例如：
 *   write_template(buf, "%d %s", 42, "hello");
 *
 * 编译器会检查：
 *   - %d 是否对应 int 类型的参数
 *   - %s 是否对应 char* 类型的参数
 *
 * 如果格式串和参数类型不匹配，编译时会给出警告。
 */

void write_template(buffer_t *buffer, const char *template, ...)
  __attribute__((format(printf, 2, 3)));

void write_int(buffer_t *buffer, int64_t n);
void write_uint(buffer_t *buffer, uint64_t n);
void write_char(buffer_t *self, char c);
void write_newline(buffer_t *self);
void write_string(buffer_t *buffer, const char *string);
void write_substring(buffer_t *self, const char *string, size_t start, size_t end);
