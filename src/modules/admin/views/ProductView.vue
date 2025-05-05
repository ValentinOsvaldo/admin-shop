<template>
  <div class="bg-white px-5 py-2 rounded">
    <h1 class="text-3xl">
      Producto: <small class="text-blue-500">{{ product?.title }}</small>
    </h1>
    <hr class="my-4" />
  </div>

  <form class="grid grid-cols-1 sm:grid-cols-2 bg-white px-5 gap-5" @submit="onSubmit">
    <div class="first-col">
      <!-- Primera parte del formulario -->
      <CustomInput label="Titulo" v-model="title" v-bind="titleAttrs" :error="errors.title" />

      <CustomInput label="Slug" v-model="slug" v-bind="slugAttrs" :error="errors.slug" />

      <CustomTextArea
        label="Descripción"
        v-model="description"
        v-bind="descriptionAttrs"
        :error="errors.description"
      ></CustomTextArea>

      <div class="flex flex-row gap-3">
        <CustomInput
          label="Precio"
          v-model.number="price"
          v-bind="priceAttrs"
          :error="errors.price"
          type="number"
        />
        <CustomInput
          label="Inventario"
          v-model.number="stock"
          v-bind="stockAttrs"
          :error="errors.stock"
          type="number"
        />
      </div>

      <div class="mb-4">
        <label for="sizes" class="form-label">Tallas</label>

        <div class="flex">
          <button
            v-for="size in allSizes"
            :key="size"
            @click="toggleSize(size)"
            type="button"
            :class="[
              'p-2 rounded w-14 mr-2 flex-1 cursor-pointer transition-all',
              {
                'bg-blue-500 text-white': hasSize(size),
                'bg-blue-100': !hasSize(size),
              },
            ]"
          >
            {{ size }}
          </button>
        </div>
      </div>
    </div>

    <!-- Segunda columna -->
    <div class="first-col">
      <label for="stock" class="form-label">Imágenes</label>
      <!-- Row with scrollable horizontal -->
      <div class="flex p-2 overflow-x-auto space-x-8 w-full h-[265px] bg-gray-200 rounded">
        <div class="flex-shrink-0" v-for="image in images" :key="image.key">
          <img :src="image.value" :alt="title" class="w-[250px] h-[250px] rounded object-contain" />
        </div>
      </div>
      <!-- Upload image -->
      <div class="col-span-2 my-2">
        <label for="image" class="form-label">Subir imagen</label>

        <input multiple type="file" id="image" class="form-control" />
      </div>

      <div class="mb-4">
        <label for="stock" class="form-label">Género</label>
        <select
          v-model="gender"
          v-bind="genderAttrs"
          :class="[
            'form-control',
            {
              'border-red-500': errors.gender,
            },
          ]"
        >
          <option value="">Seleccione</option>
          <option value="kid">Niño</option>
          <option value="women">Mujer</option>
          <option value="men">Hombre</option>
        </select>

        <span v-if="errors.gender" class="text-red-400">{{ errors.gender }}</span>
      </div>

      <!-- Botón para guardar -->
      <div class="my-4 text-right">
        <button
          type="submit"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Guardar
        </button>
      </div>
    </div>
  </form>

  <div class="grid grid-cols-2 mt-2">
    <pre class="bg-blue-200 p-2 overflow-hidden">{{ values }}</pre>
    <pre class="bg-red-200 p-2 overflow-hidden">{{ errors }}</pre>
    <pre class="bg-green-200 p-2 overflow-hidden">{{ meta }}</pre>
  </div>
</template>

<script lang="ts" src="./ProductView.ts"></script>

<style scoped>
@reference "tailwindcss";

.form-label {
  @apply block text-gray-700 text-sm font-bold mb-2;
}

.form-control {
  @apply shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none;
}
</style>
