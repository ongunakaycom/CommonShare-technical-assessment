<template>
  <div class="d-flex justify-content-center align-items-center min-vh-100 bg-light">
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
</template>

<script setup>
import { ref } from 'vue'
import { navigateTo } from '#app' // Nuxt 3 navigation composable

const email = ref('')
const password = ref('')
const error = ref('')

const handleLogin = () => {
  // Simple dummy authentication
  if (email.value === 'test@example.com' && password.value === 'password') {
    error.value = ''
    navigateTo('/dashboard') // <-- use navigateTo instead of router.push
  } else {
    error.value = 'Invalid email or password'
  }
}
</script>

<style scoped>
@media (max-width: 400px) {
  .card {
    margin: 1rem;
    padding: 1.5rem;
  }
}
</style>
