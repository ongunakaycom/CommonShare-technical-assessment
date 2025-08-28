<template>
  <div class="d-flex flex-column min-vh-100">
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div class="container">
        <a class="navbar-brand" href="#" @click.prevent="goTo('/')">MyApp</a>
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
            <!-- Guest -->
            <li class="nav-item" v-if="!currentUser">
              <a class="nav-link" href="#" @click.prevent="goTo('/')">Home</a>
            </li>

            <!-- Admin links -->
            <template v-if="currentUser && currentUser.role === 'admin'">
              <li class="nav-item">
                <a class="nav-link" href="#" @click.prevent="goTo('/dashboard')">Dashboard</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#" @click.prevent="goTo('/users')">Users</a>
              </li>
              <li class="nav-item">
                <button class="btn btn-outline-danger ms-2" @click="handleLogout">Logout</button>
              </li>
            </template>

            <!-- Regular logged-in users -->
            <template v-else-if="currentUser">
              <li class="nav-item">
                <button class="btn btn-outline-danger ms-2" @click="handleLogout">Logout</button>
              </li>
            </template>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Main content -->
    <div class="flex-grow-1">
      <!-- Login Page -->
      <div v-if="!currentUser" class="container flex-grow-1 my-5">
        <div class="row align-items-center">
          <div class="col-lg-6 mb-4 mb-lg-0">
            <h1 class="display-4">Welcome to MyApp</h1>
            <p class="lead">Discover the easiest way to manage your tasks and stay productive.</p>
          </div>
          <div class="col-lg-6 d-flex justify-content-center">
            <div class="card shadow-sm p-4 w-100" style="max-width: 400px;">
              <h1 class="text-center mb-4">Login</h1>
              <form @submit.prevent="handleLogin">
                <div class="mb-3">
                  <label for="email" class="form-label">Email</label>
                  <input v-model="email" type="email" class="form-control" placeholder="Enter your email" required />
                </div>
                <div class="mb-3">
                  <label for="password" class="form-label">Password</label>
                  <input v-model="password" type="password" class="form-control" placeholder="Enter your password" required />
                </div>
                <button type="submit" class="btn btn-primary w-100">Login</button>
              </form>
              <div v-if="error" class="alert alert-danger mt-3" role="alert">{{ error }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Dashboard for all logged-in users -->
      <div v-else-if="route === '/dashboard'" class="container my-5">
        <h1 class="mb-4">Dashboard</h1>

        <!-- Summary Cards -->
        <div class="row mb-4">
          <div class="col-md-4 mb-3" v-for="card in summaryCards" :key="card.title">
            <div class="card shadow-sm p-4 text-center">
              <h5>{{ card.title }}</h5>
              <p class="display-5 mb-0">{{ card.count }}</p>
            </div>
          </div>
        </div>

        <!-- Users vs Admins Section -->
        <div class="card shadow-sm p-4">
          <h5 class="mb-3">Users vs Admins</h5>
          <div class="progress mb-2" style="height: 30px;">
            <div
              class="progress-bar bg-primary"
              role="progressbar"
              :style="{ width: userPercentage + '%' }"
            >
              Users: {{ usersCount }}
            </div>
            <div
              class="progress-bar bg-danger"
              role="progressbar"
              :style="{ width: adminPercentage + '%' }"
            >
              Admins: {{ adminsCount }}
            </div>
          </div>
          <p class="mt-2">
            Total Users: {{ totalCount }} | Users: {{ usersCount }} | Admins: {{ adminsCount }}
          </p>
        </div>
      </div>

      <!-- Users page (Admin only) -->
      <div v-else-if="route === '/users' && currentUser?.role === 'admin'" class="container my-5">
        <h1>All Users</h1>

        <!-- Filters -->
        <div class="row mb-3">
          <div class="col-md-6 mb-2">
            <input type="text" class="form-control" placeholder="Search by name or email" v-model="search" />
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
            <li class="page-item" :class="{ disabled: currentPage === 1 }" @click="currentPage--">
              <a class="page-link" href="#">Previous</a>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }" @click="currentPage++">
              <a class="page-link" href="#">Next</a>
            </li>
          </ul>
        </nav>
      </div>

      <!-- Access Denied -->
      <div v-else class="container my-5">
        <h2 class="text-danger">Access denied or page not found.</h2>
      </div>
    </div>

    <!-- Footer -->
    <footer class="bg-light text-center text-lg-start shadow-sm mt-auto">
      <div class="text-center p-3">© {{ new Date().getFullYear() }} MyApp. All rights reserved.</div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const route = ref('/')
const isOpen = ref(false)
const email = ref('')
const password = ref('')
const error = ref('')
const users = ref([])
const currentUser = ref(null)

// Filters & pagination
const search = ref('')
const selectedCountry = ref('')
const currentPage = ref(1)
const perPage = 10

// Placeholder counts for dashboard
const usersCount = ref(120)
const adminsCount = ref(30)
const totalCount = computed(() => usersCount.value + adminsCount.value)
const userPercentage = computed(() => (usersCount.value / totalCount.value) * 100)
const adminPercentage = computed(() => (adminsCount.value / totalCount.value) * 100)
const summaryCards = [
  { title: 'Total Users', count: totalCount.value },
  { title: 'Users', count: usersCount.value },
  { title: 'Admins', count: adminsCount.value }
]

// Computed for Users page
const filteredUsers = computed(() =>
  users.value.filter(u => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.value.toLowerCase()) ||
      u.email.toLowerCase().includes(search.value.toLowerCase())
    const matchesCountry = !selectedCountry.value || u.country === selectedCountry.value
    return matchesSearch && matchesCountry
  })
)
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return filteredUsers.value.slice(start, start + perPage)
})
const countries = computed(() => [...new Set(users.value.map(u => u.country).filter(Boolean))])

// Load users.json
onMounted(async () => {
  const res = await fetch('/users.json')
  users.value = await res.json()
  const countryList = ['USA', 'UK', 'Canada', 'Germany', 'Australia']
  users.value.forEach(u => {
    if (!u.country) u.country = countryList[Math.floor(Math.random() * countryList.length)]
  })
  route.value = window.location.pathname
  if (process.client) {
    window.addEventListener('popstate', () => { route.value = window.location.pathname })
  }
})

// Login
const handleLogin = () => {
  const user = users.value.find(u => u.email === email.value && u.password === password.value)
  if (!user) { error.value = 'Invalid email or password'; return }

  currentUser.value = user
  error.value = ''
  route.value = '/dashboard'
  if (process.client) window.history.pushState({}, '', '/dashboard')
}

// Logout
const handleLogout = () => {
  currentUser.value = null        // clear logged-in user
  route.value = '/'               // redirect to home
  if (process.client) {
    window.history.pushState({}, '', '/')
  }
}

// SPA navigation
const goTo = path => {
  if (!currentUser.value) {
    // Guests can go anywhere
    route.value = path
    if (process.client) window.history.pushState({}, '', path)
    return
  }


  // Admin users
  if (currentUser.value.role === 'admin') {
    if (path === '/dashboard' || path === '/users') {
      route.value = path
      if (process.client) window.history.pushState({}, '', path)
      return
    }
  }


  // All other logged-in users (regular)
  route.value = '/dashboard'
  if (process.client) window.history.pushState({}, '', '/dashboard')
}
</script>

<style scoped>
.table { margin-top: 1rem; }
.pagination { justify-content: center; margin-top: 1rem; }
.card { border-radius: 0.5rem; }
.progress-bar { display: flex; align-items: center; justify-content: center; font-weight: bold; }
@media (max-width: 400px) { .card { margin: 1rem; padding: 1.5rem; } }
</style>
