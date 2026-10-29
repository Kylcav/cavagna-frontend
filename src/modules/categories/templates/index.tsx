import { notFound } from "next/navigation"
import { Suspense } from "react"

import InteractiveLink from "@modules/common/components/interactive-link"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import { listCategories } from "@lib/data/categories"
import { HttpTypes } from "@medusajs/types"

export default async function CategoryTemplate({
  category,
  sortBy,
  page,
  countryCode,
}: {
  category: HttpTypes.StoreProductCategory
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  if (!category || !countryCode) notFound()

  const categories = await listCategories({ limit: 100 })
    .then((categories) =>
      categories
        .filter((category) => !category.parent_category)
        .sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0))
    )
    .catch(() => [])

  const parents = [] as HttpTypes.StoreProductCategory[]

  const getParents = (category: HttpTypes.StoreProductCategory) => {
    if (category.parent_category) {
      parents.push(category.parent_category)
      getParents(category.parent_category)
    }
  }

  getParents(category)

  return (
    <div className="py-6 content-container" data-testid="category-container">
      {categories.length > 0 && (
        <div className="mb-10 overflow-x-auto">
          <nav className="flex w-max min-w-full items-center justify-center gap-10 border-b border-black/10 pb-4">
            {categories.map((cat) => {
              const isSelected = cat.handle === category.handle

              return (
                <LocalizedClientLink
                  key={cat.id}
                  href={`/categories/${cat.handle}`}
                  className={`group relative whitespace-nowrap text-sm font-bold uppercase tracking-[0.18em] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:text-[#b08a68] ${
                    isSelected ? "text-[#b08a68]" : "text-[#8a6f55]"
                  }`}
                >
                  {cat.name}

                  <span
                    className={`absolute -bottom-2 left-1/2 h-px -translate-x-1/2 bg-[#b08a68] transition-all duration-300 ease-out ${
                      isSelected ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </LocalizedClientLink>
              )
            })}
          </nav>
        </div>
      )}

      <div className="flex flex-col small:flex-row small:items-start">
        <RefinementList sortBy={sort} data-testid="sort-by-container" />

        <div className="w-full">
          <div className="flex flex-row mb-8 text-2xl-semi gap-4">
            {parents &&
              parents.map((parent) => (
                <span key={parent.id} className="text-ui-fg-subtle">
                  <LocalizedClientLink
                    className="mr-4 hover:text-black"
                    href={`/categories/${parent.handle}`}
                    data-testid="sort-by-link"
                  >
                    {parent.name}
                  </LocalizedClientLink>
                  /
                </span>
              ))}

            <h1 data-testid="category-page-title">{category.name}</h1>
          </div>

          {category.description && (
            <div className="mb-8 text-base-regular">
              <p>{category.description}</p>
            </div>
          )}

          {category.category_children && (
            <div className="mb-8 text-base-large">
              <ul className="grid grid-cols-1 gap-2">
                {category.category_children?.map((c) => (
                  <li key={c.id}>
                    <InteractiveLink href={`/categories/${c.handle}`}>
                      {c.name}
                    </InteractiveLink>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Suspense
            fallback={
              <SkeletonProductGrid
                numberOfProducts={category.products?.length ?? 8}
              />
            }
          >
            <PaginatedProducts
              sortBy={sort}
              page={pageNumber}
              categoryId={category.id}
              countryCode={countryCode}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}