#include "index.h"

static char *report_of(const char *context, struct span_t span) {
  buffer_t *buffer = make_buffer();
  write_span_in_context(buffer, span, context);
  char *report = buffer_to_string(buffer);
  buffer_free(buffer);
  return report;
}

static void assert_report(const char *context, struct span_t span, const char *expected) {
  char *report = report_of(context, span);
  if (!string_equal(report, expected)) {
    who_printf("expected:\n%sactual:\n%s", expected, report);
  }

  assert(string_equal(report, expected));
  string_free(report);
}

int main(void) {
  test_start();

  {
    // ascii -- one column per byte
    const char *context = "(define (f x) (not-found x))\n";
    struct span_t span = {
      .start = {.index = 15, .row = 0, .column = 15},
      .end = {.index = 24, .row = 0, .column = 24},
    };
    assert_report(context, span,
      " 1 | (define (f x) (not-found x))\n"
      "   |                ~~~~~~~~~     \n");
  }

  {
    // cjk -- one character per two columns
    // "(定义 不存在)": '(' 定 义 ' ' 不 存 在 ')' are characters 0..7
    const char *context = "(定义 不存在)\n";
    struct span_t span = {
      .start = {.index = 4, .row = 0, .column = 4},
      .end = {.index = 7, .row = 0, .column = 7},
    };
    assert_report(context, span,
      " 1 | (定义 不存在)\n"
      "   |       ~~~~~~  \n");
  }

  test_end();
}
