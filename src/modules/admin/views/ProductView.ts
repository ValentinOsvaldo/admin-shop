import { defineComponent, ref, watch, watchEffect } from 'vue';
import { useMutation, useQuery } from '@tanstack/vue-query';
import { useRouter } from 'vue-router';
import { useFieldArray, useForm } from 'vee-validate';
import * as yup from 'yup';
import { createUpdateProductAction, getProductById } from '@/modules/products/actions';
import CustomInput from '@/modules/common/components/CustomInput.vue';
import CustomTextArea from '@/modules/common/components/CustomTextArea.vue';
import { useToast } from 'vue-toastification';

const validationSchema = yup.object({
  title: yup.string().required(),
  slug: yup.string().required(),
  description: yup.string().required(),
  price: yup.number().required(),
  stock: yup.number().min(1).required(),
  gender: yup.string().required().oneOf(['men', 'women', 'kid']),
});

export default defineComponent({
  components: {
    CustomInput,
    CustomTextArea,
  },
  props: {
    productId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter();
    const toast = useToast();
    const {
      data: product,
      isError,
      isLoading,
      refetch,
    } = useQuery({
      queryKey: ['product', props.productId],
      queryFn: () => getProductById(props.productId),
      // retry: false,
    });
    const { defineField, values, errors, handleSubmit, resetForm, meta } = useForm({
      validationSchema,
    });

    const productMutation = useMutation({
      mutationFn: createUpdateProductAction,
    });

    const [title, titleAttrs] = defineField('title');
    const [slug, slugAttrs] = defineField('slug');
    const [description, descriptionAttrs] = defineField('description');
    const [price, priceAttrs] = defineField('price');
    const [stock, stockAttrs] = defineField('stock');
    const [gender, genderAttrs] = defineField('gender');

    const imageFiles = ref<File[]>([]);

    const { fields: sizes, remove: removeSize, push: pushSize } = useFieldArray<string>('sizes');
    const { fields: images } = useFieldArray<string>('images');

    const toggleSize = (size: string) => {
      const currentSizes = sizes.value.map((s) => s.value);
      const hasSize = currentSizes.includes(size);

      if (hasSize) {
        removeSize(currentSizes.indexOf(size));
      } else {
        pushSize(size);
      }
    };

    const onSubmit = handleSubmit(async (values) => {
      const formValues = {
        ...values,
        images: [...values.images, ...imageFiles.value],
      };
      productMutation.mutate(formValues);
    });

    const onFileChanged = (event: Event) => {
      const fileInput = event.target as HTMLInputElement;

      const fileList = fileInput.files;

      if (!fileList) return;
      if (fileList.length === 0) return;

      for (const imageFile of fileList) {
        imageFiles.value.push(imageFile);
      }
    };

    watchEffect(() => {
      if (isError.value && !isLoading.value) {
        router.replace('/admin/products');
        return;
      }
    });

    watch(
      product,
      () => {
        if (!product) return;

        resetForm({
          values: product.value,
        });
      },
      {
        deep: true,
        immediate: true,
      },
    );

    watch(productMutation.isSuccess, (value) => {
      if (!value) return;

      toast.success(`Producto actualizado correctamente`);
      router.replace(`/admin/products/${productMutation.data.value!.id}`);

      resetForm({
        values: productMutation.data.value,
      });
      imageFiles.value = [];
    });

    watch(
      () => props.productId,
      () => {
        refetch();
      },
    );

    return {
      // Props
      productMutation,

      product,
      meta,

      imageFiles,
      errors,
      values,
      title,
      titleAttrs,
      slug,
      slugAttrs,
      description,
      descriptionAttrs,
      price,
      priceAttrs,
      stock,
      stockAttrs,
      gender,
      genderAttrs,

      sizes,
      images,
      // Getters
      allSizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      // Actions
      onSubmit,
      toggleSize,

      hasSize: (size: string) => {
        const currentSizes = sizes.value.map((s) => s.value);

        return currentSizes.includes(size);
      },
      onFileChanged,
      temporalImageUrl: (file: File) => {
        return URL.createObjectURL(file);
      },
    };
  },
});
