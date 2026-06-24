import { listCategories } from "@lib/data/categories"
import HomeCategories from "./home-categories"

export default async function Home() {
  const categories = await listCategories({
  limit: 3,
  order: "rank",
})

  return <HomeCategories categories={categories} />
}