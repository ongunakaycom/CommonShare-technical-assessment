<template>
  <div>
    <!-- Navbar -->
    <nav>
      <a href="#" @click.prevent="goTo('/')">MyApp</a>
      <a v-if="isAdmin" href="#" @click.prevent="goTo('/dashboard')">Dashboard</a>
      <a v-if="isAdmin" href="#" @click.prevent="goTo('/users')">Users</a>
      <a v-if="currentUser" href="#" @click.prevent="handleLogout">Logout</a>
      <a v-else href="#" @click.prevent="goTo('/')">Login</a>
    </nav>

    <!-- Login Page -->
    <div v-if="!currentUser">
      <h2>Login</h2>
      <form @submit.prevent="handleLogin">
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
      <div v-if="error">{{ error }}</div>
    </div>

    <!-- Dashboard / Users Page -->
    <div v-else>
      <div v-if="route === '/dashboard'">
        <h2>Admin Dashboard</h2>
        <p>Welcome, {{ currentUser.name }}!</p>
        <p>Total Users: {{ users.length }} | Admins: {{ adminCount }} | Users: {{ userCount }}</p>
      </div>

      <!-- Users page (Admin only) -->
      <div v-else-if="route === '/users' && isAdmin">
        <h2>All Users</h2>

        <!-- Filters -->
        <div>
          <input type="text" v-model="search" placeholder="Search by name or email" />
          <select v-model="selectedCountry">
            <option value="">All Countries</option>
            <option v-for="c in countries" :key="c" :value="c">{{ c }}</option>
          </select>
        </div>

        <!-- Users Table -->
        <table border="1" cellspacing="0" cellpadding="5">
          <thead>
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
              <td>{{ user.country }}</td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination -->
        <div>
          <button :disabled="currentPage === 1" @click="currentPage--">Previous</button>
          <span>{{ currentPage }} / {{ totalPages }}</span>
          <button :disabled="currentPage === totalPages" @click="currentPage++">Next</button>
        </div>
      </div>

      <div v-else>
        <p>Access Denied or Page Not Found.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const route = ref('/')
const users = ref([])
const currentUser = ref(null)
const email = ref('')
const password = ref('')
const error = ref('')

// Filters & Pagination
const search = ref('')
const selectedCountry = ref('')
const currentPage = ref(1)
const perPage = 10

// Derived states
const isAdmin = computed(() => currentUser.value?.role === 'admin')
const adminCount = computed(() => users.value.filter(u => u.role === 'admin').length)
const userCount = computed(() => users.value.filter(u => u.role !== 'admin').length)

const filteredUsers = computed(() => {
  return users.value.filter(u => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.value.toLowerCase()) ||
      u.email.toLowerCase().includes(search.value.toLowerCase())
      
    const matchesCountry =
      !selectedCountry.value ||
      (u.country && u.country.toLowerCase().trim() === selectedCountry.value.toLowerCase().trim())
    
    return matchesSearch && matchesCountry
  })
})


const totalPages = computed(() => Math.ceil(filteredUsers.value.length / perPage))
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return filteredUsers.value.slice(start, start + perPage)
})

// Extract countries dynamically
const countries = computed(() => [...new Set(users.value.map(u => u.country))])

// Load users and assign random countries
onMounted(async () => {
  const res = await fetch('/users.json')
  const data = await res.json()
  const countryList = ['USA', 'UK', 'Canada', 'Germany', 'Australia']
  data.forEach(u => {
    u.country = countryList[Math.floor(Math.random() * countryList.length)]
  })
  users.value = data

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
  route.value = isAdmin.value ? '/dashboard' : '/users'
  if (process.client) window.history.pushState({}, '', route.value)
}

// Logout
const handleLogout = () => {
  currentUser.value = null
  route.value = '/'
  if (process.client) window.history.pushState({}, '', '/')
}

// SPA navigation
const goTo = path => {
  if (!currentUser.value) {
    route.value = path
    if (process.client) window.history.pushState({}, '', path)
    return
  }

  if (path === '/') {
    if (isAdmin.value) {
      route.value = '/dashboard'
      if (process.client) window.history.pushState({}, '', '/dashboard')
    }
    return
  }

  if (path === '/dashboard' && isAdmin.value) {
    route.value = '/dashboard'
    if (process.client) window.history.pushState({}, '', '/dashboard')
  } else if (path === '/users' && isAdmin.value) {
    route.value = '/users'
    if (process.client) window.history.pushState({}, '', '/users')
  }
}
</script>
