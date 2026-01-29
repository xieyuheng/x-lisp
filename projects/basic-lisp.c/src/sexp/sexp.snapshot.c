#include "index.h"

static void
echo(const char *string) {
    x_println(parse_sexps(NULL, string));
}

int
main(void) {
    init_global_gc();
    init_constant_values();

    // symbol

    echo("abc");
    echo("-sphere");
    // TODO can not handle symbol starts with number
    // echo("3-sphere");

    // hashtag

    echo("#t");
    echo("#f");
    echo("#null");
    echo("#void");

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

    // tael

    echo("[]");
    echo("[a b c]");

    // set

    echo("{}");
    echo("{a b c}");

    // list with attributes

    echo("(:x 1 :y 2)");
    echo("(a b c :x 1 :y 2)");

    // quotes

    echo("'a");
    echo("'(a)");
    echo("'(#a)");
    echo("'(a b c)");
    echo(",(a b c)");
    echo("`(a ,b c)");
}
