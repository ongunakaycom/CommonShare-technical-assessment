<script setup>
import { ref, computed, onMounted } from 'vue'

const route = ref('/')          // current SPA route
const users = ref([])           // user list
const currentUser = ref(null)   // logged-in user
const email = ref('')
const password = ref('')
const error = ref('')

// Filters & Pagination for admin
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
    const matchesCountry = !selectedCountry.value || u.country === selectedCountry.value
    return matchesSearch && matchesCountry
  })
})

const totalPages = computed(() => Math.ceil(filteredUsers.value.length / perPage))
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

  // SPA route setup
  if (process.client) {
    route.value = window.location.pathname

    window.addEventListener('popstate', () => {
      if (currentUser.value && window.location.pathname === '/') {
        const redirect = isAdmin.value ? '/dashboard' : '/users'
        window.history.replaceState({}, '', redirect)
        route.value = redirect
      } else {
        route.value = window.location.pathname
      }
    })
  }
})

// Login
const handleLogin = () => {
  const user = users.value.find(u => u.email === email.value && u.password === password.value)
  if (!user) { 
    error.value = 'Invalid email or password'
    return 
  }

  currentUser.value = user
  error.value = ''
  const redirect = isAdmin.value ? '/dashboard' : '/users'
  route.value = redirect
  if (process.client) window.history.replaceState({}, '', redirect)
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
    // Not logged in → normal navigation
    route.value = path
    if (process.client) window.history.pushState({}, '', path)
    return
  }

  // Logged-in user navigation
  if (path === '/') {
    if (isAdmin.value) {
      // Admin → dashboard
      route.value = '/dashboard'
      if (process.client) window.history.pushState({}, '', '/dashboard')
    } 
    // Regular user → do NOTHING (acts like "#")
    return
  } 

  // Other routes
  if (path === '/dashboard' && isAdmin.value) {
    route.value = '/dashboard'
    if (process.client) window.history.pushState({}, '', '/dashboard')
  } else if (path === '/users' && !isAdmin.value) {
    route.value = '/users'
    if (process.client) window.history.pushState({}, '', '/users')
  }
}

// Admin-only users page
const goToUsers = () => {
  if (isAdmin.value) {
    goTo('/dashboard')
  } else {
    alert('Access denied. Only admins can view this page.')
  }
}
</script>

<!-- Navbar -->
<nav>
  <!-- MyApp / Home -->
  <a href="#" @click.prevent="goTo('/')">MyApp</a>

  <a v-if="isAdmin" href="#" @click.prevent="goTo('/dashboard')">Dashboard</a>
  <a v-else-if="currentUser" href="#" @click.prevent="goTo('/users')">Users</a>
  <a v-if="currentUser" href="#" @click.prevent="handleLogout">Logout</a>
  <a v-else href="#" @click.prevent="goTo('/')">Login</a>
</nav>
