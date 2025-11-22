#include "index.h"

int
main(void) {
    {
        const char *code = "(a b c)";
        where_printf("code: %s\n", code);
        where_printf("echo: ");
        sexp_print(sexp_parse(code), stdout); printf("\n");
    }

    {
        const char *code = "((a \"b\" c) (a . c) (1 1.2))";
        where_printf("code: %s\n", code);
        where_printf("echo: ");
        sexp_print(sexp_parse(code), stdout); printf("\n");
    }
}
