<template>
  <div class="p-6 md:p-10">
    <h2 class="text-3xl font-bold mb-4">My Account Details</h2>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error" class="text-red-600">{{ error }}</div>

    <div v-else>
      <p><strong>Full Name:</strong> {{ user.fullName }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <p><strong>Phone:</strong> {{ user.phone }}</p>
      <p><strong>Status:</strong> {{ user.status }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { fetchUserProfile } from '@/services/api.js';

const loading = ref(true);
const error = ref(null);
const user = ref({});

onMounted(async () => {
  try {
    user.value = await fetchUserProfile();
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
});
</script>
