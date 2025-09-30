(export
  priority-queue?
  make-priority-queue
  priority-queue-get
  priority-queue-put!
  priority-queue-peek
  priority-queue-poll!)

(define-data (node? K P)
  (cons-node
   (key K)
   (priority P)
   (index int?)))

(define node-key cons-node-key)
(define node-priority cons-node-priority)
(define node-index cons-node-index)

(define put-node-priority! put-cons-node-priority!)
(define put-node-index! put-cons-node-index!)

;; heap as complete-binary-tree
(define (heap? K P) (list? (node? K P)))

(define-data (priority-queue? K P)
  (cons-priority-queue
   (compare (-> P P sort-order?))
   (node-hash (hash? K (node? K P)))
   (heap (heap? K P))))

(define priority-queue-compare cons-priority-queue-compare)
(define priority-queue-node-hash cons-priority-queue-node-hash)
(define priority-queue-heap cons-priority-queue-heap)

(define (priority-queue-length queue)
  (list-length (priority-queue-heap queue)))

(define (priority-queue-empty? queue)
  (list-empty? (priority-queue-heap queue)))

(claim make-priority-queue
  (polymorphic (K P)
    (-> (-> P P sort-order?)
        (priority-queue? K P))))

(define (make-priority-queue compare)
  (cons-priority-queue compare (@hash) (@list)))

(claim priority-queue-get
  (polymorphic (K P)
    (-> K (priority-queue? K P)
        (optional? P))))

(define (priority-queue-get key queue)
  (= node (hash-get key (priority-queue-node-hash queue)))
  (if (null? node)
    null
    (node-priority node)))

(claim priority-queue-peek
  (polymorphic (K P)
    (-> (priority-queue? K P)
        (optional? K))))

(define (priority-queue-peek queue)
  (= first (list-head (priority-queue-heap queue)))
  (if (null? first)
    null
    (node-key first)))

(claim priority-queue-poll!
  (polymorphic (K P)
    (-> (priority-queue? K P)
        (optional? K))))

(define (priority-queue-poll! queue)
  (cond ((priority-queue-empty? queue) null)
        ((equal? 1 (priority-queue-length queue))
         (= heap (priority-queue-heap queue))
         (= first (list-pop! heap))
         (= node-hash (priority-queue-node-hash queue))
         (hash-delete! (node-key first) node-hash)
         (node-key first))
        (else
         (= heap (priority-queue-heap queue))
         (= compare (priority-queue-compare queue))
         (= first (list-head heap))
         (= node-hash (priority-queue-node-hash queue))
         (hash-delete! (node-key first) node-hash)
         (= last (list-last heap))
         (node-swap! heap first last)
         (list-pop! heap)
         (node-blance! heap compare last)
         (node-key first))))

(claim priority-queue-put!
  (polymorphic (K P)
    (-> K P (priority-queue? K P)
        (priority-queue? K P))))

(define (priority-queue-put! key priority queue)
  (= heap (priority-queue-heap queue))
  (= index (list-length heap))
  (= node (cons-node key priority index))
  (list-push! node heap)
  (= node-hash (priority-queue-node-hash queue))
  (hash-put! key node node-hash)
  (= compare (priority-queue-compare queue))
  (node-blance! heap compare node)
  queue)

(claim node-blance!
  (polymorphic (K P)
    (-> (heap? K P) (-> P P sort-order?) (node? K P)
        void?)))

(define (node-blance! heap compare node)
  (= parent (node-parent heap node))
  (= left-child (node-left-child heap node))
  (= right-child (node-right-child heap node))
  (cond ((and (not (null? parent))
              (sort-order-before?
               (compare (node-priority node)
                        (node-priority parent))))
         (node-swap! heap node parent)
         (node-blance! heap compare node))
        ((and (not (null? left-child))
              (sort-order-after?
               (compare (node-priority node)
                        (node-priority left-child))))
         (node-swap! heap node left-child)
         (node-blance! heap compare node))
        ((and (not (null? right-child))
              (sort-order-after?
               (compare (node-priority node)
                        (node-priority right-child))))
         (node-swap! heap node right-child)
         (node-blance! heap compare node))
        (else void)))

(claim node-swap!
  (polymorphic (K P)
    (-> (heap? K P) (node? K P) (node? K P)
        void?)))

(define (node-swap! heap lhs rhs)
  (= lhs-index (node-index lhs))
  (= rhs-index (node-index rhs))
  (put-node-index! rhs-index lhs)
  (put-node-index! lhs-index rhs)
  (list-put! rhs-index lhs heap)
  (list-put! lhs-index rhs heap)
  void)

;; node-left-child  -- 2i + 1
;; node-right-child -- 2i + 2

(define node-getter?
  (polymorphic (K P)
    (-> (heap? K P) (node? K P)
        (optional? (node? K P)))))

(claim node-left-child node-getter?)

(define (node-left-child heap node)
  (= child-index (iadd 1 (imul 2 (node-index node))))
  (if (int-smaller? child-index (list-length heap))
    (list-get child-index heap)
    null))

(claim node-right-child node-getter?)

(define (node-right-child heap node)
  (= child-index (iadd 2 (imul 2 (node-index node))))
  (if (int-smaller? child-index (list-length heap))
    (list-get child-index heap)
    null))

(claim node-parent node-getter?)

(define (node-parent heap node)
  (= index (node-index node))
  (= parent-index
     (cond ((equal? 1 (imod index 2)) (idiv index 2))
           (else (isub (idiv index 2) 1))))
  (if (int-non-negative? parent-index)
    (list-get parent-index heap)
    null))
