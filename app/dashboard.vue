<template>
  <div class="container my-5">
    <h1 class="mb-4">Dashboard</h1>

    <!-- Users Summary Cards -->
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
</template>

<script setup>
import { ref, computed } from 'vue'

// Placeholder counts (replace with backend API later)
const usersCount = ref(120)
const adminsCount = ref(30)

const totalCount = computed(() => usersCount.value + adminsCount.value)
const userPercentage = computed(() => (usersCount.value / totalCount.value) * 100)
const adminPercentage = computed(() => (adminsCount.value / totalCount.value) * 100)

// Summary cards data
const summaryCards = [
  { title: 'Total Users', count: totalCount.value },
  { title: 'Users', count: usersCount.value },
  { title: 'Admins', count: adminsCount.value }
]
</script>

<style scoped>
/* Optional: adjust progress text */
.progress-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}
</style>
