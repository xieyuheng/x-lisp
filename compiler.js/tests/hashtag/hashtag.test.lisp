(assert (hashtag? #abc))
(assert (hashtag? #t))
(assert (hashtag? #f))
(assert (hashtag? #null))
(assert (hashtag? #void))

(assert-not (hashtag? 't))
(assert-not (hashtag? 'f))

(assert-equal "abc" (hashtag-string #abc))
