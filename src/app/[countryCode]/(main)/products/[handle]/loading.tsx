export default function Loading() {
  return (
    <div className="content-container flex flex-col gap-8 py-6 small:flex-row small:items-start">
      <div className="flex w-full flex-col gap-y-4 small:max-w-[300px]">
        <div className="h-10 w-3/4 animate-pulse rounded bg-ui-bg-subtle" />
        <div className="h-24 w-full animate-pulse rounded bg-ui-bg-subtle" />
      </div>
      <div className="aspect-[29/34] w-full animate-pulse rounded-rounded bg-ui-bg-subtle small:mx-16" />
      <div className="flex w-full flex-col gap-y-6 small:max-w-[300px]">
        <div className="h-10 w-full animate-pulse rounded bg-ui-bg-subtle" />
        <div className="h-8 w-28 animate-pulse rounded bg-ui-bg-subtle" />
        <div className="h-14 w-full animate-pulse rounded-full bg-ui-bg-subtle" />
      </div>
    </div>
  )
}
