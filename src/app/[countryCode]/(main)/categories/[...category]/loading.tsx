import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"

export default function Loading() {
  return (
    <div className="content-container py-6">
      <div className="mb-10 h-6 w-full max-w-3xl animate-pulse rounded bg-ui-bg-subtle" />
      <div className="mb-8 h-9 w-56 animate-pulse rounded bg-ui-bg-subtle" />
      <SkeletonProductGrid numberOfProducts={8} />
    </div>
  )
}
