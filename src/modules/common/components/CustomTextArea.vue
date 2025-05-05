<template>
  <div>
    <label for="title" class="form-label" v-if="label">{{ label }}</label>
    <textarea
      :type="type"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement)?.value)"
      @blur="$emit('blur')"
      :class="[
        'shadow h-32 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline',
        {
          'border-red-500': error,
        },
      ]"
    ></textarea>

    <span v-show="error" class="text-red-400">{{ error }}</span>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  label?: string;
  modelValue?: string | number;
  error?: string;
  type?: 'text' | 'number';
}

withDefaults(defineProps<Props>(), {
  type: 'text',
});

defineEmits(['update:modelValue', 'blur']);
</script>

<style scoped>
@reference "tailwindcss";

.form-label {
  @apply block text-gray-700 text-sm font-bold mb-2;
}
</style>
