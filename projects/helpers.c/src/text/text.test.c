#include "index.h"

int main(void) {
  test_start();

  {
    text_t *text = make_text("abc");
    assert(text_length(text) == 3);
    assert(text_get_code_point(text, 0) == 0x61);
    assert(text_get_code_point(text, 1) == 0x62);
    assert(text_get_code_point(text, 2) == 0x63);
    text_free(text);
  }

  {
    text_t *text = make_text("中文");
    assert(text_length(text) == 2);
    assert(text_get_code_point(text, 0) == 0x4e2d);
    assert(text_get_code_point(text, 1) == 0x6587);
    text_free(text);
  }

  {
    assert(text_equal(make_text("中文"), make_text("中文")));
    assert(!text_equal(make_text("中文"), make_text("中")));
    assert(text_equal(make_text("abc"), make_text("abc")));
    assert(!text_equal(make_text("abc"), make_text("abd")));
  }

  {
    text_t *text = make_text("中文");
    assert(text_copy(text) != text);
    assert(text_equal(text_copy(text), text));
  }

  {
    assert(
      text_equal(
        make_text("中文abc"),
        text_append(
          make_text("中文"),
          make_text("abc"))));
  }

  {
    text_t *text = make_text("中文");
    assert(
      text_equal(
        text_subtext(text, 0, 1),
        make_text("中")));
    assert(
      text_equal(
        text_subtext(text, 1, 2),
        make_text("文")));
  }

  {
    assert(
      string_equal(
        text_string(make_text("中文")),
        "中文"));
    assert(
      string_equal(
        text_string(make_text("abc")),
        "abc"));
    assert(
      string_equal(
        text_string(make_text("")),
        ""));
  }

  test_end();
}
