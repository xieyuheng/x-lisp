#pragma once

value_t value_from_position(struct position_t position);
value_t value_from_span(struct span_t span);

struct position_t value_to_position(value_t value);
struct span_t value_to_span(value_t value);
