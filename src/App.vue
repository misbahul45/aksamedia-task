<script setup lang="ts">
import Header from './components/layout/Header.vue';
import Toast from './components/ui/Toast.vue';


</script>


<template>
    <main class="bg-background relative min-h-screen">
        <Header />
        <RouterView />
        <Toast position="top-right" />
    </main>
</template>