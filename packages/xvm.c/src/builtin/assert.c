#include "index.h"

// - 失败消息中的 builtin 名与入口注册名一致
//   （meta-builtin/builtin/assert-equal 与 meta-builtin/内置/断言相等），
//   所以消息语言由「调用的是哪个 primitive」决定。
// - 标签与打印的值跟随同一语言。

static void write_assert_fail(
  const char *fail_message,
  const char *value_label,
  value_t value,
  lang_t lang
) {
  buffer_t *buffer = make_buffer();
  write_string(buffer, fail_message);
  write_string(buffer, value_label);
  write_value(buffer, value, lang);
  write_newline(buffer);
  buffer_write_and_exit(buffer, stderr, 1);
}

static void write_assert_equal_fail(
  const char *fail_message,
  const char *lhs_label,
  const char *rhs_label,
  value_t lhs,
  value_t rhs,
  lang_t lang
) {
  buffer_t *buffer = make_buffer();
  write_string(buffer, fail_message);
  write_string(buffer, lhs_label);
  write_value(buffer, lhs, lang);
  write_string(buffer, rhs_label);
  write_value(buffer, rhs, lang);
  write_newline(buffer);
  buffer_write_and_exit(buffer, stderr, 1);
}

static char *make_assert_fail_message(
  const char *fail_message,
  const char *value_label,
  value_t value,
  lang_t lang
) {
  buffer_t *buffer = make_buffer();
  write_string(buffer, fail_message);
  write_string(buffer, value_label);
  write_value(buffer, value, lang);
  char *message = buffer_to_string(buffer);
  buffer_free(buffer);
  return message;
}

static char *make_assert_equal_message(
  const char *fail_message,
  const char *lhs_label,
  const char *rhs_label,
  value_t lhs,
  value_t rhs,
  lang_t lang
) {
  buffer_t *buffer = make_buffer();
  write_string(buffer, fail_message);
  write_string(buffer, lhs_label);
  write_value(buffer, lhs, lang);
  write_string(buffer, rhs_label);
  write_value(buffer, rhs, lang);
  char *message = buffer_to_string(buffer);
  buffer_free(buffer);
  return message;
}

static void write_message_and_exit(const char *message, value_t location) {
  buffer_t *output_buffer = make_buffer();
  write_message_with_location(
    output_buffer,
    message,
    value_to_source_location(location));
  buffer_write_and_exit(output_buffer, stderr, 1);
}

value_t x_assert(value_t value) {
  if (value == x_true) return x_void;
  write_assert_fail("(assert) fail", "\n  value: ", value, LANG_EN);
  return x_void;
}

value_t x_assert_zh(value_t value) {
  if (value == x_true) return x_void;
  write_assert_fail("(断言) 失败", "\n  值：", value, LANG_ZH);
  return x_void;
}

value_t x_assert_not(value_t value) {
  if (value == x_false) return x_void;
  write_assert_fail("(assert-not) fail", "\n  value: ", value, LANG_EN);
  return x_void;
}

value_t x_assert_not_zh(value_t value) {
  if (value == x_false) return x_void;
  write_assert_fail("(断言非) 失败", "\n  值：", value, LANG_ZH);
  return x_void;
}

value_t x_assert_equal(value_t lhs, value_t rhs) {
  if (equal(lhs, rhs)) return x_void;
  write_assert_equal_fail(
    "(assert-equal) fail", "\n  lhs: ", "\n  rhs: ", lhs, rhs, LANG_EN);
  return x_void;
}

value_t x_assert_equal_zh(value_t lhs, value_t rhs) {
  if (equal(lhs, rhs)) return x_void;
  write_assert_equal_fail(
    "(断言相等) 失败", "\n  左边：", "\n  右边：", lhs, rhs, LANG_ZH);
  return x_void;
}

value_t x_assert_not_equal(value_t lhs, value_t rhs) {
  if (!equal(lhs, rhs)) return x_void;
  write_assert_equal_fail(
    "(assert-not-equal) fail", "\n  lhs: ", "\n  rhs: ", lhs, rhs, LANG_EN);
  return x_void;
}

value_t x_assert_not_equal_zh(value_t lhs, value_t rhs) {
  if (!equal(lhs, rhs)) return x_void;
  write_assert_equal_fail(
    "(断言不等) 失败", "\n  左边：", "\n  右边：", lhs, rhs, LANG_ZH);
  return x_void;
}

value_t x_assert_with_location(value_t value, value_t location) {
  if (value == x_true) return x_void;

  char *message = make_assert_fail_message(
    "(assert) fail", "\n  value: ", value, LANG_EN);
  write_message_and_exit(message, location);
  return x_void;
}

value_t x_assert_with_location_zh(value_t value, value_t location) {
  if (value == x_true) return x_void;

  char *message = make_assert_fail_message(
    "(断言) 失败", "\n  值：", value, LANG_ZH);
  write_message_and_exit(message, location);
  return x_void;
}

value_t x_assert_not_with_location(value_t value, value_t location) {
  if (value == x_false) return x_void;

  char *message = make_assert_fail_message(
    "(assert-not) fail", "\n  value: ", value, LANG_EN);
  write_message_and_exit(message, location);
  return x_void;
}

value_t x_assert_not_with_location_zh(value_t value, value_t location) {
  if (value == x_false) return x_void;

  char *message = make_assert_fail_message(
    "(断言非) 失败", "\n  值：", value, LANG_ZH);
  write_message_and_exit(message, location);
  return x_void;
}

value_t x_assert_equal_with_location(value_t lhs, value_t rhs, value_t location) {
  if (equal(lhs, rhs)) return x_void;

  char *message = make_assert_equal_message(
    "(assert-equal) fail", "\n  lhs: ", "\n  rhs: ", lhs, rhs, LANG_EN);
  write_message_and_exit(message, location);
  return x_void;
}

value_t x_assert_equal_with_location_zh(value_t lhs, value_t rhs, value_t location) {
  if (equal(lhs, rhs)) return x_void;

  char *message = make_assert_equal_message(
    "(断言相等) 失败", "\n  左边：", "\n  右边：", lhs, rhs, LANG_ZH);
  write_message_and_exit(message, location);
  return x_void;
}

value_t x_assert_not_equal_with_location(value_t lhs, value_t rhs, value_t location) {
  if (!equal(lhs, rhs)) return x_void;

  char *message = make_assert_equal_message(
    "(assert-not-equal) fail", "\n  lhs: ", "\n  rhs: ", lhs, rhs, LANG_EN);
  write_message_and_exit(message, location);
  return x_void;
}

value_t x_assert_not_equal_with_location_zh(value_t lhs, value_t rhs, value_t location) {
  if (!equal(lhs, rhs)) return x_void;

  char *message = make_assert_equal_message(
    "(断言不等) 失败", "\n  左边：", "\n  右边：", lhs, rhs, LANG_ZH);
  write_message_and_exit(message, location);
  return x_void;
}