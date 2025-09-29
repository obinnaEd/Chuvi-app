<template>
  <div class="p-6 md:p-10">
    <h2 class="text-3xl font-bold mb-4">My Addresses</h2>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error" class="text-red-600">{{ error }}</div>

    <div v-else>
      <div v-for="addr in addresses" :key="addr._id" class="p-4 mb-3 border rounded">
        <p><strong>{{ addr.label }}</strong></p>
        <p>{{ addr.line1 }}, {{ addr.city }}, {{ addr.state }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { fetchAddresses } from '@/services/api.js';

const loading = ref(true);
const error = ref(null);
const addresses = ref([]);

onMounted(async () => {
  try {
    const res = await fetchAddresses();
    addresses.value = res.addresses; // backend returns { addresses: [] }
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
});
</script>
