import type { Metadata } from 'next';
import { initDB } from '@/lib/db';
import { listCategories } from '@/lib/cms/categories';
import PostEditor from '@/app/admin/(auth)/transmissions/PostEditor';

export const metadata: Metadata = { title: 'New Transmission' };

export default function NewTransmissionPage() {
  initDB();
  const categories = listCategories();
  return <PostEditor categories={categories} />;
}
