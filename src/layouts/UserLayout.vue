<template>
  <div class="bg-gray-100">
    <UserHeader />
    <main>
      <router-view />
    </main>
    <UserFooter />
  </div>
</template>

<script setup>
import UserHeader from '@/components/user/UserHeader.vue';
import UserFooter from '@/components/user/UserFooter.vue';
</script>