import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { initDB } from '@/lib/db';
import { adminGetPost } from '@/lib/cms/posts';
import { listCategories } from '@/lib/cms/categories';
import PostEditor from '@/app/[locale]/admin/(auth)/transmissions/PostEditor';

export const metadata: Metadata = { title: 'Edit Transmission' };

export default async function EditTransmissionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  initDB();
  const post = adminGetPost(Number(id));
  if (!post) notFound();
  const categories = listCategories();
  return <PostEditor post={post as any} categories={categories} />;
}
