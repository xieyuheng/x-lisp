#include "index.h"

int
main(void) {
    test_start();

    where_printf("time_second(): %f\n", time_second());
    where_printf("time_second(): %f\n", time_second());
    where_printf("time_second(): %f\n", time_second());

    where_printf("time_nanosecond(): %lu\n", time_nanosecond());
    where_printf("time_nanosecond(): %lu\n", time_nanosecond());
    where_printf("time_nanosecond(): %lu\n", time_nanosecond());

    test_end();
}
