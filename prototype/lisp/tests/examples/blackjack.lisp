(define-data suit?
  club diamond spade heart)

(define-data rank?
  two three four five six seven eight
  nine ten jack queen king ace)

(define card? (tau suit? rank?))
(define hand? (list? card?))
(define deck? (list? card?))

(define player? (tau :name string? :hand hand?))
(define game? (tau :deck deck? :players (list? player?)))

(claim deal
  (-> deck? (tau deck? card?)))

(claim pickup-card
  (-> (tau hand? card?) hand?))
