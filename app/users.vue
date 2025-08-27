<template>
  <div class="container my-5">
    <h1 class="mb-4">Users Page</h1>
    <div class="row">
      <!-- Placeholder cards for UI layout -->
      <div class="col-md-4 mb-3" v-for="i in 6" :key="i">
        <div class="card shadow-sm p-3">
          <h5>User {{ i }}</h5>
          <p>Email placeholder</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  // For now, no dynamic data; ready to plug in JSON later
</script>

<style scoped>
/* Optional responsive tweaks */
@media (max-width: 576px) {
  .card {
    margin: 0.5rem 0;
  }
}
</style>
