<template>
  <div class="d-flex flex-column min-vh-100">
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div class="container">
        <a class="navbar-brand" href="#">MyApp</a>
        <button
          class="navbar-toggler"
          type="button"
          @click="isOpen = !isOpen"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div :class="['collapse navbar-collapse', { show: isOpen }]">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <a class="nav-link" href="#" @click.prevent="goTo('/')">Home</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#" @click.prevent="goToUsers()">Users</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Main content -->
    <div class="flex-grow-1">
      <!-- Home / Login -->
      <div v-if="route === '/'" class="container flex-grow-1 my-5">
        <div class="row align-items-center">
          <!-- Left flex -->
          <div class="col-lg-6 mb-4 mb-lg-0">
            <h1 class="display-4">Welcome to MyApp</h1>
            <p class="lead">
              Discover the easiest way to manage your tasks and stay productive.
            </p>
          </div>

          <!-- Right flex -->
          <div class="col-lg-6 d-flex justify-content-center">
            <div class="card shadow-sm p-4 w-100" style="max-width: 400px;">
              <h1 class="text-center mb-4">Login</h1>

              <form @submit.prevent="handleLogin">
                <div class="mb-3">
                  <label for="email" class="form-label">Email</label>
                  <input
                    v-model="email"
                    type="email"
                    class="form-control"
                    id="email"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div class="mb-3">
                  <label for="password" class="form-label">Password</label>
                  <input
                    v-model="password"
                    type="password"
                    class="form-control"
                    id="password"
                    placeholder="Enter your password"
                    required
                  />
                </div>

                <button type="submit" class="btn btn-primary w-100">Login</button>
              </form>

              <div v-if="error" class="alert alert-danger mt-3" role="alert">
                {{ error }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- User Dashboard -->
      <div v-else-if="route === '/user'" class="container my-5">
        <h1>User Dashboard</h1>
        <p>Welcome, {{ currentUser?.name }}!</p>
      </div>

      <!-- Admin Dashboard -->
      <div v-else-if="route === '/dashboard'" class="container my-5">
        <h1>Admin Dashboard</h1>
        <p>Welcome, {{ currentUser?.name }}!</p>

        <!-- Users Table -->
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

      <!-- Access denied -->
      <div v-else class="container my-5">
        <h2 class="text-danger">Access denied or page not found.</h2>
      </div>
    </div>

    <!-- Footer -->
    <footer class="bg-light text-center text-lg-start shadow-sm mt-auto">
      <div class="text-center p-3">
        © {{ new Date().getFullYear() }} MyApp. All rights reserved.
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// SPA state
const route = ref('/')
const isOpen = ref(false)

// Login state
const email = ref('')
const password = ref('')
const error = ref('')

// Users data
const users = ref([])
const currentUser = ref(null)

// Filters & pagination for admin table
const search = ref('')
const selectedCountry = ref('')
const currentPage = ref(1)
const perPage = 10

// Computed values
const filteredUsers = computed(() => {
  return users.value.filter(u => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.value.toLowerCase()) ||
      u.email.toLowerCase().includes(search.value.toLowerCase())
    const matchesCountry = !selectedCountry.value || u.country === selectedCountry.value
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

const countries = computed(() => {
  return [...new Set(users.value.map(u => u.country).filter(Boolean))]
})

// Load users.json on client
onMounted(async () => {
  if (process.client) {
    const res = await fetch('/users.json')
    users.value = await res.json()

    // Assign random country if missing
    const countryList = ['USA', 'UK', 'Canada', 'Germany', 'Australia']
    users.value.forEach(u => {
      if (!u.country) u.country = countryList[Math.floor(Math.random() * countryList.length)]
    })

    // Default route
    route.value = window.location.pathname
    window.addEventListener('popstate', () => {
      route.value = window.location.pathname
    })
  }
})

// Login logic with role-based redirect
const handleLogin = () => {
  const user = users.value.find(
    u => u.email === email.value && u.password === password.value
  )
  if (!user) {
    error.value = 'Invalid email or password'
    return
  }
  currentUser.value = user
  error.value = ''
  if (user.role === 'admin') {
    route.value = '/dashboard'
    if (process.client) window.history.pushState({}, '', '/dashboard')
  } else {
    route.value = '/user'
    if (process.client) window.history.pushState({}, '', '/user')
  }
}

// SPA navigation
const goTo = path => {
  route.value = path
  if (process.client) window.history.pushState({}, '', path)
}

// Only admins can access /users page
const goToUsers = () => {
  if (currentUser.value?.role === 'admin') {
    goTo('/dashboard')
  } else {
    alert('Access denied. Only admins can view this page.')
  }
}
</script>

<style scoped>
.table {
  margin-top: 1rem;
}
.pagination {
  justify-content: center;
  margin-top: 1rem;
}
@media (max-width: 400px) {
  .card {
    margin: 1rem;
    padding: 1.5rem;
  }
}
</style>
