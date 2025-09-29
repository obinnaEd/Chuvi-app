<template>
  <div class="p-6 md:p-10">
    <h2 class="text-3xl font-bold mb-4">Preferences</h2>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error" class="text-red-600">{{ error }}</div>

    <form @submit.prevent="save">
      <label class="block">
        <input type="checkbox" v-model="preferences.darkMode" />
        Dark Mode
      </label>
      <label class="block">
        <input type="checkbox" v-model="preferences.emailNotifications" />
        Email Notifications
      </label>
      <button type="submit" class="btn-primary mt-4">Save Preferences</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { fetchUserProfile, updatePreferences } from '@/services/api.js';

const loading = ref(true);
const error = ref(null);
const preferences = ref({ darkMode: false, emailNotifications: false });

onMounted(async () => {
  try {
    const user = await fetchUserProfile();
    preferences.value = user.preferences || {};
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
});

const save = async () => {
  try {
    await updatePreferences({ preferences: preferences.value });
    alert('Preferences updated!');
  } catch (err) {
    error.value = err.message;
  }
};
</script>
