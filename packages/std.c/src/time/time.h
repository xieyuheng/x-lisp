#pragma once

double time_second(void);
double time_second_passed(double start_second);

double time_millisecond(void);
double time_millisecond_passed(double start_millisecond);

uint64_t time_nanosecond(void);
uint64_t time_nanosecond_passed(uint64_t start_nanosecond);
bool time_nanosecond_sleep(long nanosecond);
