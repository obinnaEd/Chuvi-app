<template>
  <div class="flex">
    <AdminSidebar />
    <AdminHeader />
    <main class="flex-1 p-8">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import AdminSidebar from '@/components/admin/AdminSidebar.vue';
import AdminHeader from '@/components/admin/AdminHeader.vue'
</script>