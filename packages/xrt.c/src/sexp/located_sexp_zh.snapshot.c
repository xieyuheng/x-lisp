#include "index.h"

static void echo(const char *string) {
  x_println(parse_located_sexps_zh("*", string));
}

int main(void) {
  init_global_gc();

  // symbol

  echo("abc");
  echo("-sphere");
  echo("3-sphere");
  echo("3f2c1");
  echo("3f2c1a8d/builtin/int-add");

  // number

  echo("1");
  echo("0");
  echo("-1");
  echo("0.0");
  echo("3.14");

  // list

  echo("()");
  echo("(a b c)");
  echo("(a (b) c)");
  echo("(:x 1 :y 2)");
  echo("(a b c :x 1 :y 2)");

  // literal list

  echo("[]");
  echo("[a b c]");

  // record

  echo("{}");
  echo("{:x 1 :y 2}");

  // quotes

  echo("'a");
  echo("'(a)");
  echo("'(#a)");
  echo("'(a b c)");
  echo(",(a b c)");
  echo("`(a ,b c)");
  echo("(f 'a x)");
}
