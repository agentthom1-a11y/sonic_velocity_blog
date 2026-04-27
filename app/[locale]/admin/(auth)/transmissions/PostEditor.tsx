'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { listCategories } from '@/lib/cms/categories';

// This is a client component that handles form state
// Real category list comes as prop from the server parent

interface PostEditorProps {
  post?: {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    contentMarkdown: string | null;
    coverImageUrl: string | null;
    coverImageAlt: string | null;
    status: string;
    featured: number;
    seoTitle: string | null;
    metaDescription: string | null;
    canonicalUrl: string | null;
    scheduledAt: string | null;
    tags: string[];
    categoryId: number | null;
  };
  categories: { id: number; name: string; slug: string }[];
}

export default function PostEditor({ post, categories }: PostEditorProps) {
  const router = useRouter();
  const isNew  = !post;

  const [title,        setTitle]        = useState(post?.title || '');
  const [slug,         setSlug]         = useState(post?.slug || '');
  const [excerpt,      setExcerpt]      = useState(post?.excerpt || '');
  const [content,      setContent]      = useState(post?.contentMarkdown || '');
  const [coverUrl,     setCoverUrl]     = useState(post?.coverImageUrl || '');
  const [coverAlt,     setCoverAlt]     = useState(post?.coverImageAlt || '');
  const [status,       setStatus]       = useState(post?.status || 'draft');
  const [featured,     setFeatured]     = useState(post ? post.featured === 1 : false);
  const [seoTitle,     setSeoTitle]     = useState(post?.seoTitle || '');
  const [metaDesc,     setMetaDesc]     = useState(post?.metaDescription || '');
  const [canonical,    setCanonical]    = useState(post?.canonicalUrl || '');
  const [scheduledAt,  setScheduledAt]  = useState(post?.scheduledAt || '');
  const [tagsInput,    setTagsInput]    = useState((post?.tags || []).join(', '));
  const [categoryId,   setCategoryId]   = useState(post?.categoryId?.toString() || '');
  const [authorName,   setAuthorName]   = useState('Sonic Velocity');
  const [saving,       setSaving]       = useState(false);
  const [message,      setMessage]      = useState('');

  const autoSlug = (t: string) => t.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').slice(0, 100);

  const handleTitleChange = (v: string) => {
    setTitle(v);
    if (isNew) setSlug(autoSlug(v));
  };

  const save = async (overrideStatus?: string) => {
    setSaving(true);
    setMessage('');
    const effectiveStatus = overrideStatus ?? status;
    const payload = {
      title, excerpt, content_markdown: content,
      slug, cover_image_url: coverUrl, cover_image_alt: coverAlt,
      seo_title: seoTitle, meta_description: metaDesc, canonical_url: canonical,
      featured, status: effectiveStatus, scheduled_at: scheduledAt || undefined,
      author_name: authorName,
      tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
      category: categories.find(c => c.id.toString() === categoryId)?.name,
    };

    try {
      const url = isNew ? '/api/admin/transmissions' : `/api/admin/transmissions/${post!.id}`;
      const method = isNew ? 'POST' : 'PATCH';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(`Error: ${data.error}`);
      } else {
        if (isNew) {
          router.push(`/admin/transmissions/${data.post.id}`);
        } else {
          setMessage(`Saved — status: ${effectiveStatus}`);
        }
      }
    } catch {
      setMessage('Network error');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!isNew) {
      setSaving(true);
      const res = await fetch(`/api/admin/transmissions/${post!.id}/publish`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) setMessage(`Published! View: /transmissions/${data.slug}`);
      else setMessage(`Error: ${data.error}`);
      setSaving(false);
    } else {
      await save('published');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 font-mono">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <a href="/admin/transmissions" className="text-[9px] text-neutral-600 uppercase tracking-widest hover:text-white transition-colors">← Back to list</a>
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter mt-2">
            {isNew ? 'New Transmission' : 'Edit Transmission'}
          </h1>
        </div>

        <div className="flex gap-3">
          <button onClick={() => save('draft')} disabled={saving} className="px-4 py-2 border border-neutral-800 text-[9px] uppercase tracking-widest text-neutral-400 hover:text-white hover:border-neutral-600 transition-all disabled:opacity-50">
            Save Draft
          </button>
          <button onClick={() => save('review')} disabled={saving} className="px-4 py-2 border border-yellow-900 text-[9px] uppercase tracking-widest text-yellow-600 hover:text-yellow-400 transition-all disabled:opacity-50">
            Submit Review
          </button>
          <button onClick={handlePublish} disabled={saving} className="px-6 py-2 bg-white text-black text-[9px] font-black uppercase tracking-widest hover:bg-green-400 transition-colors disabled:opacity-50">
            {saving ? '...' : 'Publish Now'}
          </button>
        </div>
      </div>

      {message && (
        <div className={`mb-6 px-4 py-3 text-[10px] uppercase tracking-widest border ${message.startsWith('Error') ? 'border-red-900 text-red-400 bg-red-950/20' : 'border-green-900 text-green-400 bg-green-950/20'}`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <label className="text-[9px] uppercase tracking-[0.3em] text-neutral-600 block mb-2">Title *</label>
            <input value={title} onChange={e => handleTitleChange(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors" placeholder="Post title..." />
          </div>

          <div>
            <label className="text-[9px] uppercase tracking-[0.3em] text-neutral-600 block mb-2">Slug</label>
            <input value={slug} onChange={e => setSlug(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-white transition-colors" placeholder="auto-generated-from-title" />
          </div>

          <div>
            <label className="text-[9px] uppercase tracking-[0.3em] text-neutral-600 block mb-2">Excerpt *</label>
            <textarea value={excerpt} onChange={e => setExcerpt(e.target.value)} rows={3} className="w-full bg-neutral-950 border border-neutral-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors resize-y" placeholder="Brief summary..." />
          </div>

          <div>
            <label className="text-[9px] uppercase tracking-[0.3em] text-neutral-600 block mb-2">
              Content (Markdown) *
            </label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={24}
              className="w-full bg-neutral-950 border border-neutral-800 px-4 py-3 text-sm text-white font-mono leading-relaxed focus:outline-none focus:border-white transition-colors resize-y"
              placeholder="## Heading&#10;&#10;Your content here..."
            />
            <p className="text-[8px] text-neutral-700 mt-1">{content.trim().split(/\s+/).length} words · ~{Math.max(1, Math.round(content.trim().split(/\s+/).length / 200))} min read</p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="border border-neutral-900 p-4 space-y-4">
            <h3 className="text-[9px] uppercase tracking-[0.3em] text-neutral-600 border-b border-neutral-900 pb-3">Post Settings</h3>

            <div>
              <label className="text-[8px] uppercase tracking-widest text-neutral-700 block mb-2">Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-xs text-white focus:outline-none">
                {['draft', 'review', 'scheduled', 'published', 'archived'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="text-[8px] uppercase tracking-widest text-neutral-700 block mb-2">Category</label>
              <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-xs text-white focus:outline-none">
                <option value="">— Select —</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div>
              <label className="text-[8px] uppercase tracking-widest text-neutral-700 block mb-2">Tags (comma-separated)</label>
              <input value={tagsInput} onChange={e => setTagsInput(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-xs text-white focus:outline-none" placeholder="tag1, tag2, tag3" />
            </div>

            <div>
              <label className="text-[8px] uppercase tracking-widest text-neutral-700 block mb-2">Author</label>
              <input value={authorName} onChange={e => setAuthorName(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-xs text-white focus:outline-none" />
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={featured} onChange={e => setFeatured(e.target.checked)} className="w-4 h-4 accent-cyan-500" />
              <span className="text-[8px] uppercase tracking-widest text-neutral-500">Featured Post</span>
            </label>
          </div>

          <div className="border border-neutral-900 p-4 space-y-4">
            <h3 className="text-[9px] uppercase tracking-[0.3em] text-neutral-600 border-b border-neutral-900 pb-3">Cover Image</h3>
            <div>
              <label className="text-[8px] uppercase tracking-widest text-neutral-700 block mb-2">Image URL</label>
              <input value={coverUrl} onChange={e => setCoverUrl(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-xs text-white focus:outline-none" placeholder="https://... or /images/..." />
            </div>
            <div>
              <label className="text-[8px] uppercase tracking-widest text-neutral-700 block mb-2">Alt Text</label>
              <input value={coverAlt} onChange={e => setCoverAlt(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-xs text-white focus:outline-none" />
            </div>
            {coverUrl && <img src={coverUrl} alt="preview" className="w-full h-32 object-cover grayscale border border-neutral-800 mt-2" />}
          </div>

          <div className="border border-neutral-900 p-4 space-y-4">
            <h3 className="text-[9px] uppercase tracking-[0.3em] text-neutral-600 border-b border-neutral-900 pb-3">SEO</h3>
            <div>
              <label className="text-[8px] uppercase tracking-widest text-neutral-700 block mb-2">SEO Title</label>
              <input value={seoTitle} onChange={e => setSeoTitle(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-xs text-white focus:outline-none" />
              <p className="text-[7px] text-neutral-700 mt-1">{seoTitle.length}/60</p>
            </div>
            <div>
              <label className="text-[8px] uppercase tracking-widest text-neutral-700 block mb-2">Meta Description</label>
              <textarea value={metaDesc} onChange={e => setMetaDesc(e.target.value)} rows={3} className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-xs text-white focus:outline-none resize-none" />
              <p className="text-[7px] text-neutral-700 mt-1">{metaDesc.length}/160</p>
            </div>
            <div>
              <label className="text-[8px] uppercase tracking-widest text-neutral-700 block mb-2">Canonical URL</label>
              <input value={canonical} onChange={e => setCanonical(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-xs text-white focus:outline-none" />
            </div>
          </div>

          {status === 'scheduled' && (
            <div className="border border-blue-900 p-4">
              <label className="text-[8px] uppercase tracking-widest text-blue-500 block mb-2">Schedule Publish At</label>
              <input type="datetime-local" value={scheduledAt} onChange={e => setScheduledAt(e.target.value)} className="w-full bg-neutral-950 border border-blue-900 px-3 py-2 text-xs text-white focus:outline-none" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
