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
      // Prevent going back to '/' after login
      if (currentUser.value && window.location.pathname === '/') {
        const redirect = currentUser.value.role === 'admin' ? '/dashboard' : '/users'
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
  if (!user) { error.value = 'Invalid email or password'; return }

  currentUser.value = user
  error.value = ''
  const redirect = user.role === 'admin' ? '/dashboard' : '/users'
  route.value = redirect
  if (process.client) {
    window.history.replaceState({}, '', redirect)  // replace '/' in history
  }
}

// Logout
const handleLogout = () => {
  currentUser.value = null
  route.value = '/'
  if (process.client) window.history.pushState({}, '', '/')
}

// SPA navigation (navbar links)
const goTo = path => {
  if (currentUser.value) {
    // Prevent logged-in users from going back to '/' (Home)
    if (path === '/') return
    // Admins: allow dashboard link
    if (path === '/dashboard' && isAdmin.value) {
      route.value = path
      if (process.client) window.history.pushState({}, '', path)
    }
  } else {
    // Not logged in: allow Home
    route.value = path
    if (process.client) window.history.pushState({}, '', path)
  }
}

// Users link (admin only)
const goToUsers = () => {
  if (currentUser.value?.role === 'admin') {
    route.value = '/dashboard'
    if (process.client) window.history.pushState({}, '', '/dashboard')
  } else {
    alert('Access denied. Only admins can view this page.')
  }
}
</script>
