<script setup lang="ts">
import Sidebar from './Sidebar.vue';

</script>

<template>
    <div class="flex gap-4 h-screen">
        <Sidebar />
        <main class="flex-1 max-h-full overflow-auto">
            <RouterView/>
        </main>
    </div>
</template>