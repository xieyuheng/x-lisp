#pragma once

int64_t int_max(int64_t x, int64_t y);
int64_t int_min(int64_t x, int64_t y);

uint64_t uint_max(uint64_t x, uint64_t y);
uint64_t uint_min(uint64_t x, uint64_t y);

char *uint_to_string(uint64_t self);
char *uint_to_subscript(uint64_t self);
char *uint_to_superscript(uint64_t self);

size_t uint_decimal_length(uint64_t self);

uint64_t int_relu(int64_t self);

void int_print(int64_t self);
void uint_print(uint64_t self);
