"use client";

import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Category = "all" | "MensClothes" | "WomensClothes" | "KidsClothes" | "Shoes";

interface Product {
  id: number;
  name: string;
  category: Category;
  pricing: number;
  Updated_at?: string;
}

export default function EditProduct() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [name, setName] = useState<string>("");
  const [category, setCategory] = useState<Category>("all");
  const [pricing, setPricing] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleProduct = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(`/api/product?id=${id}`);

      const productData = Array.isArray(res.data.product)
        ? res.data.product[0]
        : res.data.product;

      setProduct(productData);

      setName(productData.name || "");
      setCategory(productData.category || "all");
      setPricing(String(productData.pricing || ""));
    } catch (error) {
      console.log(error);
      setError("Failed to fetch product.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!name || !category || !pricing) {
      setError("Please fill all fields.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await axios.put(`/api/product`, {
        id,
        name,
        category,
        pricing: Number(pricing),
      });

      router.push("/");
    } catch (error) {
      console.log(error);
      setError("Failed to update product.");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (id) {
      handleProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto mt-32 max-w-3xl px-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-6 h-8 w-48 animate-pulse rounded bg-slate-100" />
          <div className="space-y-5">
            <div className="h-12 animate-pulse rounded-2xl bg-slate-100" />
            <div className="h-12 animate-pulse rounded-2xl bg-slate-100" />
            <div className="h-12 animate-pulse rounded-2xl bg-slate-100" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto mt-32 max-w-3xl px-4">
        <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-red-700">
          Product not found.
        </div>
      </div>
    );
  }

  return (
    <section className="mx-auto mt-24 w-full max-w-3xl px-4 pb-12 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">
            Edit Product
          </p>

          <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            Product #{id}
          </h1>

          <p className="mt-3 text-sm text-slate-500">
            Update product name, category and pricing.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter product name"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none transition-all focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Category
            </label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none transition-all focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
            >
              <option value="all">All</option>
              <option value="MensClothes">Men&apos;s Clothes</option>
              <option value="WomensClothes">Women&apos;s Clothes</option>
              <option value="KidsClothes">Kid&apos;s Clothes</option>
              <option value="Shoes">Shoes</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Pricing
            </label>

            <input
              type="number"
              value={pricing}
              onChange={(e) => setPricing(e.target.value)}
              placeholder="Enter price"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none transition-all focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
            />
          </div>

          <div className="flex flex-col gap-3 pt-4 sm:flex-row">
            <button
              onClick={handleUpdate}
              disabled={saving}
              className="rounded-2xl bg-slate-950 px-6 py-4 text-sm font-bold text-white transition-all hover:bg-emerald-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : "Update Product"}
            </button>

            <button
              onClick={() => router.back()}
              className="rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm font-bold text-slate-700 transition-all hover:bg-slate-50 active:scale-95"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}