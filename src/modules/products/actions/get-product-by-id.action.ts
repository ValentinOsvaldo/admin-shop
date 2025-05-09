/* eslint-disable @typescript-eslint/no-explicit-any */
import { tesloApi } from '@/api/tesloApi';
import { type Product } from '../interfaces/product.interface';
import { getProductImageAction } from './get-product-image.action';

export const getProductById = async (productId: string): Promise<Product> => {
  if (productId === 'create') {
    return {
      id: '',
      title: '',
      price: 0,
      description: '',
      slug: '',
      stock: 0,
      sizes: [],
      gender: '' as any,
      tags: [],
      images: [],
      user: {} as any,
    };
  }

  try {
    const { data } = await tesloApi.get<Product>(`/products/${productId}`);

    return { ...data, images: data.images.map(getProductImageAction) };
  } catch (error) {
    console.error(error);

    throw new Error(`Error getting product by id ${productId}`);
  }
};
