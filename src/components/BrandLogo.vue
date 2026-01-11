<template>
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    :class="className"
  >
    <!-- Document Backdrop (Soft) -->
    <path
      d="M6 6C6 3.79086 7.79086 2 10 2H19.5L26 8.5V26C26 28.2091 24.2091 30 22 30H10C7.79086 30 6 28.2091 6 26V6Z"
      class="text-surface-200 dark:text-surface-700"
      fill="currentColor"
    />
    
    <!-- Image/Resource Element (Strong) -->
    <rect
      x="11"
      y="11"
      width="15"
      height="15"
      rx="3"
      class="text-primary-600 dark:text-primary-500"
      fill="currentColor"
    />
    
    <!-- Image Details (Mountain/Sun) -->
    <path
      d="M11 21.5L14.5 18L18.5 22"
      stroke="white"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M17 20.5L20 17.5L26 23.5"
      stroke="white"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <circle cx="21.5" cy="15.5" r="1.5" fill="white" />
  </svg>
</template>

<script setup lang="ts">
defineProps<{
  className?: string
}>()
</script>
