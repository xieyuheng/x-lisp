#include "index.h"

double time_second(void) {
  return (double) os_monotonic_nanoseconds() / 1e9;
}

double time_second_passed(double start_second) {
  double end_second = time_second();
  return end_second - start_second;
}

double time_millisecond(void) {
  return (double) os_monotonic_nanoseconds() / 1e6;
}

double time_millisecond_passed(double start_millisecond) {
  double end_millisecond = time_millisecond();
  return end_millisecond - start_millisecond;
}

uint64_t time_nanosecond(void) {
  return os_monotonic_nanoseconds();
}

uint64_t time_nanosecond_passed(uint64_t start_nanosecond) {
  uint64_t end_nanosecond = time_nanosecond();
  return end_nanosecond - start_nanosecond;
}

bool time_nanosecond_sleep(long nanosecond) {
  if (nanosecond < 0) return false;
  os_sleep_nanoseconds((uint64_t) nanosecond);
  return true;
}
