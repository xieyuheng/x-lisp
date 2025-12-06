#pragma once

struct position_t { size_t index, row, column; };
struct span_t { struct position_t start, end; };
