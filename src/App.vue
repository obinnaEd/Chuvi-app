<script setup>
import Navbar from "@/components/default/Navbar.vue";
import Footer from "@/components/default/Footer.vue";
</script>

<template>
  <div>
    <Navbar />
    <router-view />
    <Footer />
  </div>
  <!-- <h1 class="bg-navy-blue text-cream">here we go from here to school</h1> -->
</template>

<style>
body {
  font-family: var(--font-display);
}
</style>
