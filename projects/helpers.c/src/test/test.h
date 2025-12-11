#pragma once

double test_time_millisecond(void);
double test_time_passed_millisecond(double start_millisecond);

#define test_start(...)                                         \
    double test_start_millisecond = test_time_millisecond();    \
    printf("%s:%d -- start\n", __FILE__, __LINE__)

#define test_end(...)                                                   \
    printf("%s:%d -- end %.3f ms\n", __FILE__, __LINE__, test_time_passed_millisecond(test_start_millisecond))

#define where_printf(...) printf("%s:%d ", __FILE__, __LINE__); printf(__VA_ARGS__)
#define who_printf(...) printf("[%s] ", __func__); printf(__VA_ARGS__)

#define TODO() where_printf("TODO"); assert(false && "TODO")
