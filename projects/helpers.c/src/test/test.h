#pragma once

double test_time_millisecond(void);
double test_time_passed_millisecond(double start_millisecond);

#define test_start(...) ((void) 0)
#define test_end(...) ((void) 0)

#define test_start_log(...) \
    double test_start_millisecond = test_time_millisecond();    \
    printf("[%s] start\n", __FILE__)
#define test_end_log(...) printf("[%s] end: %.3f ms\n", __FILE__, test_time_passed_millisecond(test_start_millisecond))

#define where_printf(...) printf("%s: ", __FILE__); printf(__VA_ARGS__)
#define who_printf(...) printf("[%s] ", __func__); printf(__VA_ARGS__)
