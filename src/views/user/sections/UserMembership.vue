<template>
  <div class="p-6 md:p-10">
    <h2 class="text-3xl font-bold mb-4">Membership</h2>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error" class="text-red-600">{{ error }}</div>

    <div v-else>
      <p>Status: <strong>{{ user.isMember ? 'Active Member' : 'Not a Member' }}</strong></p>
      <p v-if="user.membershipStartedAt">
        Started: {{ new Date(user.membershipStartedAt).toLocaleDateString() }}
      </p>
      <button v-if="!user.isMember" @click="join" class="btn-primary mt-4">Join Membership</button>
      <button v-if="user.isMember" @click="leave" class="btn-secondary mt-4">Leave Membership</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { fetchUserProfile, joinMembership, leaveMembership } from '@/services/api.js';

const loading = ref(true);
const error = ref(null);
const user = ref({});

const load = async () => {
  loading.value = true;
  try {
    user.value = await fetchUserProfile();
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

const join = async () => {
  await joinMembership();
  await load();
};

const leave = async () => {
  await leaveMembership();
  await load();
};

onMounted(load);
</script>
