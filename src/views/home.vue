<template>
  <div class="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-6 mt-8">
    <h1 class="text-3xl font-bold mb-6 text-center text-indigo-700">Todo List</h1>

    <form @submit.prevent="addOrUpdateTodo" class="flex gap-4 mb-6">
      <input
        v-model="newTodo"
        placeholder="Add new task"
        class="flex-1 p-3 border border-gray-300 rounded"
      />
      <button
        type="submit"
        class="bg-indigo-600 text-white px-12 py-3 cursor-pointer rounded hover:bg-indigo-700 transition"
      >
        Add
      </button>
    </form>
    <!-- filters to display relevant tasks -->
    <div class="flex justify-between items-center mb-4">
      <!-- Left side: "All" label -->
      <span class="text-sm font-medium text-gray-700">All</span>

      <!-- Right side: "Sort By" Dropdown Button -->
      <div class="relative inline-block">
        <button
          @click="toggleDropdown"
          class="px-4 py-2 rounded-lg text-sm font-semibold transition bg-white text-gray-500 border border-gray-500 flex gap-2"
        >
          <span> Sort By</span>
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m19.5 8.25-7.5 7.5-7.5-7.5"
              />
            </svg>
          </span>
        </button>

        <!-- Dropdown Content -->
        <div
          v-show="isDropdownOpen"
          class="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10"
        >
          <ul class="py-1">
            <li
              @click="
                filter = 'completed';
                closeDropdown();
              "
              class="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              Completed
            </li>
            <li
              @click="
                filter = 'not_completed';
                closeDropdown();
              "
              class="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              Not Completed
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="overflow-x-auto">
      <table
        class="min-w-full text-sm text-left text-gray-500 border border-gray-300 rounded-xl"
      >
        <thead class="text-xs text-gray-700 uppercase bg-gray-100">
          <tr>
            <th class="px-4 py-3">S.No</th>
            <th class="px-6 py-3">Task</th>
            <th class="px-6 py-3">Status</th>
            <th class="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(todo, index) in paginatedTodos"
            :key="todo.id"
            class="bg-white border-b hover:bg-gray-50"
          >
            <!-- S.No. -->
            <td class="px-4 py-4">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>

            <!-- Task name-->
            <td class="px-6 py-4">
              <span :class="{ 'text-gray-500': todo.completed }">{{ todo.text }}</span>
            </td>

            <!-- Status Badge -->
            <td class="py-4">
              <span
                :class="[
                  'py-2 flex justify-center gap-1 rounded-2xl text-xs font-medium',
                  todo.completed
                    ? 'bg-green-100 text-green-700'
                    : 'bg-orange-100 text-orange-500',
                ]"
              >
                <!-- Icon for Completed Status -->
                <svg
                  v-if="todo.completed"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  class="text-green-700 w-5 h-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>

                <!-- Icon for Not Completed Status -->
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  class="w-4 h-4"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>

                {{ todo.completed ? "Completed" : "Not Completed" }}
              </span>
            </td>

            <!-- Actions -->
            <td class="px-6 py-4 text-right flex justify-end gap-3">
              <!-- Toggle Switch -->
              <label
                class="inline-flex items-center cursor-pointer"
                title="Toggle Status"
              >
                <input
                  type="checkbox"
                  class="sr-only peer"
                  :checked="todo.completed"
                  @change.prevent="toggleTodo(todo.id)"
                />
                <div
                  class="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-indigo-600 relative transition"
                >
                  <div
                    class="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-full"
                  ></div>
                </div>
              </label>

              <!-- Edit Icon -->
              <button
                @click="startEditing(todo)"
                title="Edit"
                class="text-gray-600 hover:text-gray-500 cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                  />
                </svg>
              </button>

              <!-- Delete Icon -->
              <button
                @click="deleteTodo(todo.id)"
                title="Delete"
                class="text-red-500 hover:text-red-700 cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="mt-6 flex justify-end items-center gap-2">
        <button
          @click="currentPage--"
          :disabled="currentPage === 1"
          class="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
        >
          Prev
        </button>

        <button
          v-for="page in totalPages"
          :key="page"
          @click="currentPage = page"
          :class="[
            'px-3 py-1 rounded',
            currentPage === page
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700',
          ]"
        >
          {{ page }}
        </button>

        <button
          @click="currentPage++"
          :disabled="currentPage === totalPages"
          class="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useTodoStore } from "../stores/todo";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

const todoStore = useTodoStore();
const newTodo = ref("");
const editingId = ref(null);
const filter = ref("all"); // default filter
const currentPage = ref(1);
const itemsPerPage = 10;
const isDropdownOpen = ref(false);

// Add Todo
function addTodo() {
  if (newTodo.value.trim()) {
    todoStore.addTodo(newTodo.value);
    toast.success("Todo added!");
    newTodo.value = "";
  }
}

// Edit state
const editingTodo = ref(null);

function startEdit(todo) {
  editingTodo.value = { ...todo };
  newTodo.value = todo.text;
}

function saveEdit() {
  if (editingTodo.value && newTodo.value.trim()) {
    todoStore.updateTodo(editingTodo.value.id, newTodo.value);
    toast.info("Todo updated!");
    editingTodo.value = null;
    newTodo.value = "";
  }
}

// Toggle between only two filters: completed ↔ not_completed
function cycleFilter() {
  if (filter.value === "all") {
    filter.value = "completed";
  } else if (filter.value === "completed") {
    filter.value = "not_completed";
  } else {
    filter.value = "all";
  }
}
function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value;
}

// Close the dropdown when an option is selected
function closeDropdown() {
  isDropdownOpen.value = false;
}

// This method will apply the appropriate class based on the selected filter
function filterBtnClass(val) {
  return [
    "px-4 py-2 rounded-lg text-sm font-semibold transition",
    val === "completed"
      ? "bg-green-600 text-white hover:bg-green-700"
      : val === "not_completed"
      ? "bg-orange-500 text-white hover:bg-orange-600"
      : "bg-indigo-500 text-white hover:bg-indigo-600",
  ].join(" ");
}

// Computed property to filter the todos based on the current selected filter
const filteredTodos = computed(() => {
  if (filter.value === "completed") {
    return todoStore.todos.filter((t) => t.completed);
  } else if (filter.value === "not_completed") {
    return todoStore.todos.filter((t) => !t.completed);
  } else {
    return todoStore.todos;
  }
});

// Paginated todos
const paginatedTodos = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredTodos.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(() => Math.ceil(filteredTodos.value.length / itemsPerPage));

function goToPage(page) {
  currentPage.value = page;
}
function addOrUpdateTodo() {
  if (!newTodo.value.trim()) return;

  if (editingId.value) {
    todoStore.updateTodo(editingId.value, newTodo.value);
    toast.success("Todo updated successfully!");
    editingId.value = null;
  } else {
    todoStore.addTodo(newTodo.value);
    toast.success("Todo added successfully!");
  }

  newTodo.value = "";
}
function startEditing(todo) {
  newTodo.value = todo.text;
  editingId.value = todo.id;
}
function toggleTodo(id) {
  todoStore.toggleTodo(id);
  toast.success("Task status updated!");
}
// Delete todo
function deleteTodo(id) {
  todoStore.deleteTodo(id);
  toast.error("Todo deleted!");
}
</script>
