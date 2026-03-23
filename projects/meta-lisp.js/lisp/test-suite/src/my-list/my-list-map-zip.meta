(import-all "my-list")

(export-all)

(claim my-list-map-zip
  (polymorphic (A B C)
    (-> (-> A B C) (my-list-t A) (my-list-t B)
        (my-list-t C))))

(define (my-list-map-zip f list1 list2)
  (match-many (list1 list2)
    ((nil _) nil)
    (((li head1 tail1) nil) nil)
    (((li head1 tail1) (li head2 tail2))
     (li (f head1 head2) (my-list-map-zip f tail1 tail2)))))

(claim my-list-map-zip-2
  (polymorphic (A B C)
    (-> (-> A B C) (my-list-t A) (my-list-t B)
        (my-list-t C))))

(define (my-list-map-zip-2 f list1 list2)
  (match-many (list1 list2)
    ((nil _) nil)
    ((_ nil) nil)
    (((li head1 tail1) (li head2 tail2))
     (li (f head1 head2) (my-list-map-zip-2 f tail1 tail2)))))
