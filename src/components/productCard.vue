<template>
  <div>
    <div @click="openModal"
      class="cursor-pointer bg-white rounded-2xl shadow-md overflow-hidden w-full max-w-sm transform transition-transform duration-300 hover:scale-105 hover:shadow-lg lg:h-[370px] md:h-[420px] flex flex-col">
      <div class="relative">
        <img :src="product.thumbnail" :alt="product.title" class="w-full h-56 object-contain" />
        <div class="absolute top-2 right-2 flex gap-2 z-10">
          <!-- Wishlist Button -->
          <button @click.stop="toggleWishlist" class="bg-white p-1 rounded-full shadow hover:bg-gray-100">
            <svg v-if="isWishlisted" class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
                   2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 
                   3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 
                   3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <svg v-else class="w-4 h-5 text-red-500" fill="none" stroke="currentColor" stroke-width="2"
              viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
                   2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 
                   3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 
                   3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>

          <!-- Cart (Basket) Button -->
          <button class="bg-white p-1 rounded-full shadow hover:bg-gray-100">
            <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M5 8h14l-1.5 9h-11L5 8zm1 0l-1-4h14l-1 4M9 21a1 1 0 100-2 1 1 0 000 2zm6 0a1 1 0 100-2 1 1 0 000 2z" />
            </svg>
          </button>
        </div>
      </div>
      <div class="py-5 px-4 flex-grow flex flex-col">
        <h2 class="text-lg font-medium text-gray-900 mb-2">
          {{ product.title.slice(0, 20) }}
        </h2>
        <p class="text-sm text-gray-600 mb-3 leading-relaxed">
          {{ product.description.slice(0, 65)
          }}{{ product.description.length > 65 ? "..." : "" }}
        </p>
        <div class="mt-auto flex items-center gap-4">
          <span class="text-lg font-medium text-green-600"> ${{ discountedPrice }} </span>
          <span class="text-sm line-through text-gray-500"> ${{ product.price }} </span>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 backdrop-blur-sm bg-white/30 flex justify-center items-center z-50 px-4">
      <div
        class="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg p-6 relative border border-gray-500">
        <button class="absolute top-2 right-2 cursor-pointer rounded-full text-red-500 text-2xl"
          @click="showModal = false">
          &times;
        </button>

        <img :src="product.thumbnail" class="w-full h-64 object-contain rounded mb-4" />
        <h2 class="text-xl font-medium mb-2 pt-4">{{ product.title }}</h2>
        <p class="text-gray-700 mb-4">{{ product.description }}</p>

        <div class="flex items-center justify-between mb-4">
          <div>
            <span class="text-lg font-bold text-green-600"> ${{ discountedPrice }} </span>
            <span class="text-sm line-through text-gray-500 ml-2">
              ${{ product.price }}
            </span>
          </div>
          <div class="flex items-center gap-2">
            <div class="flex text-yellow-400">
              <span v-for="n in 5" :key="n">
                <svg v-if="n <= Math.round(product.rating)" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                  viewBox="0 0 24 24" class="w-4 h-4">
                  <path d="M12 .587l3.668 7.431L24 9.75l-6 5.848L19.335 24 
                      12 19.897 4.665 24 6 15.598 0 9.75l8.332-1.732z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  class="w-4 h-4">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 
                      12 18.26 5.82 22 7 14.14l-5-4.87 
                      6.91-1.01L12 2z" />
                </svg>
              </span>
            </div>
            <span class="text-sm text-gray-700">{{ product.rating }}</span>
          </div>
        </div>

        <p class="text-sm text-gray-500 mb-1">Brand: {{ product.brand }}</p>
        <p class="text-sm text-gray-400">Category: {{ product.category }}</p>
      </div>
    </div>

    <!-- Toast -->
    <transition name="fade">
      <div v-if="showToast"
        class="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow z-50">
        Added to wishlist!
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({ product: Object });

const showModal = ref(false);
const showToast = ref(false);
const isWishlisted = ref(false);

const openModal = () => {
  showModal.value = true;
};

const toggleWishlist = () => {
  isWishlisted.value = !isWishlisted.value;
  if (isWishlisted.value) {
    showToast.value = true;
    setTimeout(() => {
      showToast.value = false;
    }, 2000);
  }
};

const discountedPrice = computed(() => {
  return (
    props.product.price -
    (props.product.price * props.product.discountPercentage) / 100
  ).toFixed(2);
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
