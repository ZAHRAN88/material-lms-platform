import { db } from "@/lib/db";
import Categories from "@/components/custom/Categories";

const fetchCategoriesFromDB = async () => {
  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      subCategories: {
        orderBy: {
          name: "asc",
        },
      },
    },
  });
  return categories;
};

const CategoryFetcher = async ({ selectedCategory }: { selectedCategory: string }) => {
  const categories = await fetchCategoriesFromDB();

  return <Categories categories={categories} selectedCategory={selectedCategory} />;
};

export async function getStaticCategories() {
  return await fetchCategoriesFromDB();
}

export default CategoryFetcher;