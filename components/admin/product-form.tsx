"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useRef, useState } from "react";
import { ArrowLeft, Upload, X } from "lucide-react";
import { saveProductAction } from "@/app/admin/actions";
import { Field } from "../ui";
import { CATEGORY_NAMES, COMPARE_AT, PRICE, slugify, type Category, type Product } from "@/lib/products";

type Option = { slug: string; name: string };

export default function ProductForm({ product, matchOptions }: { product?: Product; matchOptions: Option[] }) {
  const [state, action, pending] = useActionState(saveProductAction, undefined);
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [category, setCategory] = useState<Category>(product?.category ?? "Bedsheets");
  const [name, setName] = useState(product?.name ?? "");
  const [slugEdited, setSlugEdited] = useState(Boolean(product));
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setUploadError("");
    const body = new FormData();
    Array.from(files).forEach((f) => body.append("files", f));
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Upload failed");
      setImages((imgs) => [...imgs, ...json.urls]);
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function addUrl() {
    const clean = url.trim().split("?")[0];
    if (!clean.startsWith("https://images.unsplash.com/")) {
      setUploadError("Paste an images.unsplash.com link, or upload a file instead.");
      return;
    }
    setImages((imgs) => [...imgs, clean]);
    setUrl("");
    setUploadError("");
  }

  const move = (i: number, to: number) =>
    setImages((imgs) => {
      const next = [...imgs];
      const [x] = next.splice(i, 1);
      next.splice(to, 0, x);
      return next;
    });

  return (
    <form action={action} className="grid gap-3 xl:grid-cols-[1fr_360px]">
      {product && <input type="hidden" name="originalSlug" value={product.slug} />}
      <input type="hidden" name="images" value={images.join("\n")} />

      <div className="grid content-start gap-3">
        <section className="border border-line bg-paper p-5">
          <h2 className="mb-4 text-[14px] font-medium">Details</h2>
          <div className="grid gap-4">
            <Field label="Name">
              <input
                name="name"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!slugEdited) setSlug(slugify(e.target.value));
                }}
                className="field"
              />
            </Field>
            <Field label="URL name">
              <div className="flex items-center border border-line bg-stone pl-3 text-[13px] text-muted focus-within:border-ink">
                /product/
                <input
                  name="slug"
                  required
                  value={slug}
                  onChange={(e) => {
                    setSlugEdited(true);
                    setSlug(e.target.value);
                  }}
                  className="w-full bg-paper px-2 py-3 text-[14px] text-ink outline-none"
                />
              </div>
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Category">
                <select name="category" value={category} onChange={(e) => setCategory(e.target.value as Category)} className="field">
                  {CATEGORY_NAMES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>
              <Field label="Colour">
                <input name="colour" defaultValue={product?.colour} placeholder="e.g. Blue" className="field" />
              </Field>
            </div>
            {category === "Pillow Covers" && (
              <Field label="Matches with (shown as “Complete the set”)">
                <select name="match" defaultValue={product?.match ?? ""} className="field">
                  <option value="">— None —</option>
                  {matchOptions.map((o) => (
                    <option key={o.slug} value={o.slug}>
                      {o.name}
                    </option>
                  ))}
                </select>
              </Field>
            )}
          </div>
        </section>

        <section className="border border-line bg-paper p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[14px] font-medium">Photos</h2>
            <p className="text-xs text-muted">The first photo is shown on product cards.</p>
          </div>

          {images.length > 0 && (
            <ul className="mb-4 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5">
              {images.map((src, i) => (
                <li key={src + i} className="group relative aspect-[3/4] bg-stone">
                  <Image src={src} alt="" fill sizes="160px" className="object-cover" />
                  {i === 0 && <span className="absolute left-1 top-1 bg-ink px-1.5 py-0.5 text-[10px] text-paper">Main</span>}
                  <button
                    type="button"
                    aria-label="Remove photo"
                    onClick={() => setImages((imgs) => imgs.filter((_, k) => k !== i))}
                    className="absolute right-1 top-1 bg-paper p-1"
                  >
                    <X size={12} />
                  </button>
                  <div className="absolute inset-x-1 bottom-1 flex gap-1 text-[10px]">
                    {i > 0 && (
                      <button type="button" onClick={() => move(i, 0)} className="flex-1 bg-paper py-1">
                        Make main
                      </button>
                    )}
                    {i > 0 && (
                      <button type="button" onClick={() => move(i, i - 1)} className="bg-paper px-2 py-1" aria-label="Move left">
                        ←
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="btn btn-outline py-2.5">
              <Upload size={14} /> {uploading ? "Uploading…" : "Upload photos"}
            </button>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple hidden onChange={(e) => upload(e.target.files)} />
            <div className="flex min-w-[260px] flex-1">
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addUrl();
                  }
                }}
                placeholder="…or paste an images.unsplash.com link"
                className="field border-r-0 py-2.5"
              />
              <button type="button" onClick={addUrl} className="btn btn-outline px-4 py-2.5">
                Add
              </button>
            </div>
          </div>
          {uploadError && <p className="mt-2 text-[13px] text-sale">{uploadError}</p>}
        </section>
      </div>

      <div className="grid content-start gap-3">
        <section className="border border-line bg-paper p-5">
          <h2 className="mb-4 text-[14px] font-medium">Pricing & stock</h2>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Price (Rs.)">
                <input name="price" type="number" min={1} required defaultValue={product?.price ?? PRICE} className="field" />
              </Field>
              <Field label="Was (Rs.)">
                <input name="compareAt" type="number" min={1} required defaultValue={product?.compareAt ?? COMPARE_AT} className="field" />
              </Field>
            </div>
            <Field label="Stock">
              <input name="stock" type="number" min={0} step={1} required defaultValue={product?.stock ?? 50} className="field" />
            </Field>
          </div>
        </section>

        <section className="border border-line bg-paper p-5">
          <h2 className="mb-4 text-[14px] font-medium">Visibility</h2>
          <label className="flex items-center gap-3 py-1 text-[14px]">
            <input type="checkbox" name="active" defaultChecked={product?.active ?? true} className="accent-[var(--ink)]" />
            Show in store
          </label>
          <label className="flex items-center gap-3 py-1 text-[14px]">
            <input type="checkbox" name="isNew" defaultChecked={product?.isNew ?? true} className="accent-[var(--ink)]" />
            Mark as “New”
          </label>
        </section>

        {state?.error && <p className="border border-sale bg-paper p-4 text-[13px] text-sale">{state.error}</p>}
        <div className="flex gap-2">
          <button disabled={pending || uploading} className="btn flex-1">
            {pending ? "Saving…" : product ? "Save changes" : "Add product"}
          </button>
          <Link href="/admin/products" className="btn btn-outline">
            <ArrowLeft size={14} /> Back
          </Link>
        </div>
      </div>
    </form>
  );
}
