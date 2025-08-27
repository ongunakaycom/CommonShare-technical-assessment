<template>
  <div class="container my-5" v-if="isAdmin">
    <h1 class="mb-4">Users Page</h1>

    <!-- Filters -->
    <div class="row mb-3">
      <div class="col-md-6 mb-2">
        <input
          type="text"
          class="form-control"
          placeholder="Search by name or email"
          v-model="search"
        />
      </div>
      <div class="col-md-6 mb-2">
        <select class="form-select" v-model="selectedCountry">
          <option value="">All Countries</option>
          <option v-for="c in countries" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>
    </div>

    <!-- Users Table -->
    <table class="table table-bordered shadow-sm">
      <thead class="table-light">
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Country</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in paginatedUsers" :key="user.id">
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.role }}</td>
          <td>{{ user.country || 'N/A' }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination -->
    <nav>
      <ul class="pagination">
        <li
          class="page-item"
          :class="{ disabled: currentPage === 1 }"
          @click="currentPage--"
        >
          <a class="page-link" href="#">Previous</a>
        </li>
        <li
          class="page-item"
          :class="{ disabled: currentPage === totalPages }"
          @click="currentPage++"
        >
          <a class="page-link" href="#">Next</a>
        </li>
      </ul>
    </nav>
  </div>

  <div v-else class="container my-5">
    <h2 class="text-danger">Access denied. Only admins can view this page.</h2>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Props or global state (replace with Pinia later)
const currentUser = ref(null)
const users = ref([])

// Filters & Pagination
const search = ref('')
const selectedCountry = ref('')
const currentPage = ref(1)
const perPage = 10

// Derived states
const isAdmin = computed(() => currentUser.value?.role === 'admin')

const filteredUsers = computed(() => {
  return users.value.filter(u => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.value.toLowerCase()) ||
      u.email.toLowerCase().includes(search.value.toLowerCase())

    const matchesCountry =
      !selectedCountry.value || u.country === selectedCountry.value

    return matchesSearch && matchesCountry
  })
})

const totalPages = computed(() =>
  Math.ceil(filteredUsers.value.length / perPage)
)

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return filteredUsers.value.slice(start, start + perPage)
})

// Extract unique countries from users
const countries = computed(() => {
  return [...new Set(users.value.map(u => u.country).filter(Boolean))]
})

// Load users.json
onMounted(async () => {
  const res = await fetch('/users.json')
  users.value = await res.json()

  // For demo, assign random countries if missing
  const countryList = ['USA', 'UK', 'Canada', 'Germany', 'Australia']
  users.value.forEach(u => {
    if (!u.country) u.country = countryList[Math.floor(Math.random() * countryList.length)]
  })

  // Assume admin is logged in for now
  currentUser.value = users.value.find(u => u.role === 'admin')
})
</script>

<style scoped>
.table {
  margin-top: 1rem;
}
.pagination {
  justify-content: center;
  margin-top: 1rem;
}
</style>
