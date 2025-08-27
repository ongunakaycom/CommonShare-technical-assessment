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
              <a class="nav-link" href="#" @click.prevent="goTo('/users')">Users</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Main content -->
    <div class="flex-grow-1">
      <!-- Home / Login Page -->
      <div v-if="route === '/' " class="container flex-grow-1 my-5">
        <div class="row align-items-center">
          <!-- Left flex (Welcome / CTA) -->
          <div class="col-lg-6 mb-4 mb-lg-0">
            <h1 class="display-4">Welcome to MyApp</h1>
            <p class="lead">
              Discover the easiest way to manage your tasks and stay productive.
            </p>
          </div>

          <!-- Right flex (Login block) -->
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

      <!-- Users Page -->
      <div v-else-if="route === '/users'" class="container my-5">
        <h1 class="mb-4">Users Page</h1>
        <div class="row">
          <div class="col-md-4 mb-3" v-for="i in 6" :key="i">
            <div class="card shadow-sm p-3">
              <h5>User {{ i }}</h5>
              <p>Email placeholder</p>
            </div>
          </div>
        </div>
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
import { ref, onMounted } from 'vue'
import { navigateTo } from '#app'

// SPA route state
const route = ref(window.location.pathname)
const isOpen = ref(false)

// Login form
const email = ref('')
const password = ref('')
const error = ref('')

const handleLogin = () => {
  if (email.value === 'test@example.com' && password.value === 'password') {
    error.value = ''
    navigateTo('/dashboard')
  } else {
    error.value = 'Invalid email or password'
  }
}

// Manual SPA navigation
const goTo = (path) => {
  route.value = path
  window.history.pushState({}, '', path)
}

// Handle browser back/forward buttons
onMounted(() => {
  window.addEventListener('popstate', () => {
    route.value = window.location.pathname
  })
})
</script>

<style scoped>
/* Login card responsive adjustments */
@media (max-width: 400px) {
  .card {
    margin: 1rem;
    padding: 1.5rem;
  }
}
</style>
