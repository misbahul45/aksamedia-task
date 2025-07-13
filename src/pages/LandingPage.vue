<script setup lang="ts">
import AboutSection from '@/components/LandingPage/AboutSection.vue';
import CtaSection from '@/components/LandingPage/CtaSection.vue';
import FeatureSection from '@/components/LandingPage/FeatureSection.vue';
import HeroSection from '@/components/LandingPage/HeroSection.vue';

</script>

<template>
    <main class="h-screen bg-background ">
        <HeroSection />
        <AboutSection />
        <FeatureSection />
        <CtaSection /> 
    </main>
</template>