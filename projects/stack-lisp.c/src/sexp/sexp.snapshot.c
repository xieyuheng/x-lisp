#include "index.h"

static void echo(const char *string) {
  x_println(parse_sexps(string));
}

int main(void) {
  init_global_gc();

  // symbol

  echo("abc");
  echo("-sphere");
  // TODO can not handle symbol starts with number
  // echo("3-sphere");

  // keyword

  echo(":abc");

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
