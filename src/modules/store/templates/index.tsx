import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { listCategories } from "@lib/data/categories"

import PaginatedProducts from "./paginated-products"

const StoreTemplate = async ({
  sortBy,
  page,
  countryCode,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  const categories = await listCategories({ limit: 100 })
    .then((categories) => {
      console.log(
        "CATEGORIES MEDUSA:",
        categories.map((c) => ({
          id: c.id,
          name: c.name,
          handle: c.handle,
          parent: c.parent_category,
        }))
      )

      return categories
        .filter((category) => !category.parent_category)
        .sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0))
    })
    .catch((err) => {
      console.error("ERREUR CATEGORIES:", err)
      return []
    })

  return (
    <div className="py-6 content-container" data-testid="category-container">
      {categories.length > 0 && (
        <div className="mb-10 overflow-x-auto">
          <nav className="flex w-max min-w-full items-center justify-center gap-10 border-b border-black/10 pb-4">
            {categories.map((category) => (
              <LocalizedClientLink
                key={category.id}
                href={`/categories/${category.handle}`}
                className="whitespace-nowrap text-sm font-bold uppercase tracking-[0.18em] text-[#171412] transition-colors hover:text-black"
              >
                {category.name}
              </LocalizedClientLink>
            ))}
          </nav>
        </div>
      )}

      <div className="flex flex-col small:flex-row small:items-start">
        <RefinementList sortBy={sort} />

        <div className="w-full">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-widest text-[#8a6f55]">
              Boutique
            </p>

            <h1
              className="mt-2 text-4xl font-bold tracking-tight"
              data-testid="store-page-title"
            >
              Tous nos produits
            </h1>
          </div>

          <Suspense fallback={<SkeletonProductGrid />}>
            <PaginatedProducts
              sortBy={sort}
              page={pageNumber}
              countryCode={countryCode}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

export default StoreTemplate