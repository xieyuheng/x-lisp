(import category-t "category.lisp")
(import functor-t "functor.lisp")

;; To each natural translation,
;; from a construction `F` of type `A -> B`,
;; to a construction `G` of type `A -> B`,
;; there corresponds a natural transformation `F => G`.

;; This captures the concept of "natural translation".

;; The naturality condition of natural-transformation
;; state squares commute.

;; Which can be viewed as stating that
;; the arrows in the two embeddings
;; are "orthogonal" to the transforming arrows.

;; This concept was the historical origin of category theory,
;; since Eilenberg and MacLane (1945) used it to formalise
;; the notion of an equivalence of homology theories,

;; and then found that for this definition to make sense,
;; they had to define functors,

;; (A homology theory is a functor.)

;; and for functors to make sense,
;; they had to define categories.

;; (A homology theory is a functor,
;; from the category of topology spaces
;; to the category of abelian groups.)

(define-class natural-transformation-t ()
  (claim dom category-t)
  (claim cod category-t)
  ;; NOTE The following use of `(functor-t dom cod)`
  ;;  is an example of fulfilling type.
  (claim src (functor-t dom cod))
  (claim tar (functor-t dom cod))
  (claim component
    (forall ((x dom:object-t))
      (cod:morphism-t (src:map x) (tar:map x))))
  (claim naturality
    (implicit ((x dom:object-t)
               (y dom:object-t))
      (forall ((f (dom:morphism-t x y)))
        (equal-t (cod:morphism-t (src:map x) (tar:map y))
          (cod:compose (component x) (tar:fmap f))
          (cod:compose (src:fmap f) (component y)))))))
