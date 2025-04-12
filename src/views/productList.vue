<template>
  <div class="lg:container mx-auto lg:px-10 px-6 py-4">
    <h1 class="text-3xl font-bold mb-6">Product Catalog</h1>
    <div class="flex justify-between flex-wrap md:pt-4">
      <!-- Sticky Tabs -->
      <div class="sticky top-0 z-30 bg-white py-4 mb-4 flex flex-wrap gap-4 md:justify-center">
        <button v-for="category in categories" :key="category" @click="filterByCategory(category)"
          class="px-4 py-2 rounded-full border border-gray-300 hover:bg-blue-400 transition"
          :class="{ 'bg-blue-500 text-white': selectedCategory === category }">
          {{ category }}
        </button>
      </div>

      <!-- Filters and Sorting -->
      <div class="flex flex-wrap items-center justify-between gap-4 mb-6 px-2">
        <div>
          <label class="pe-2 font-medium">Sort by:</label>
          <select v-model="sortOption" class="border rounded p-2">
            <option value="default">Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
      <div v-for="i in 8" :key="i" class="bg-white rounded-2xl shadow-md h-72"></div>
    </div>
    <div v-else-if="error" class="text-center text-red-600">{{ error }}</div>
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12 pt-10">
      <ProductCard v-for="product in sortedAndFilteredProducts" :key="product.id" :product="product" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useProductStore } from "@/stores/product";
import ProductCard from "@/components/productCard.vue";

const productStore = useProductStore();
const selectedCategory = ref("All");
const sortOption = ref("default");

const categories = ["All", "Furniture", "Beauty", "Groceries"];

onMounted(() => {
  productStore.fetchProducts();
});

const products = computed(() => productStore.products);
const isLoading = computed(() => productStore.isLoading);
const error = computed(() => productStore.error);

const filterByCategory = (category) => {
  selectedCategory.value = category;
};

const sortedAndFilteredProducts = computed(() => {
  let filtered = [...products.value];

  if (selectedCategory.value !== "All") {
    filtered = filtered.filter((p) =>
      p.category.toLowerCase().includes(selectedCategory.value.toLowerCase())
    );
  }

  if (sortOption.value === "price-asc") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortOption.value === "price-desc") {
    filtered.sort((a, b) => b.price - a.price);
  }

  return filtered;
});
</script>

<style>
.loader {
  border-top-color: #3490dc;
  animation: spin 1s infinite linear;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
