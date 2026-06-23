"use client";

import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { CategoryContext } from "../context";
import axios from "axios";
import Pagination from "./Pagination";

type Category = "all" | "MensClothes" | "WomensClothes" | "KidsClothes" | "Shoes";

interface Product {
  id: number;
  name: string;
  category: Category;
  pricing: number;
  Updated_at: string;
}

const CATEGORY_LABELS: Record<Category, string> = {
  all: "All Collection",
  MensClothes: "Men's Clothes",
  WomensClothes: "Women's Clothes",
  KidsClothes: "Kid's Clothes",
  Shoes: "Shoes",
};

const CATEGORY_STYLES: Record<Category, string> = {
  all: "bg-slate-100 text-slate-700",
  MensClothes: "bg-blue-50 text-blue-700",
  WomensClothes: "bg-pink-50 text-pink-700",
  KidsClothes: "bg-yellow-50 text-yellow-700",
  Shoes: "bg-emerald-50 text-emerald-700",
};

function ProductSkeleton() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-6 flex items-center gap-4">
        <div className="h-14 w-14 animate-pulse rounded-2xl bg-slate-100" />
        <div className="flex-1 space-y-3">
          <div className="h-4 w-3/4 animate-pulse rounded bg-slate-100" />
          <div className="h-3 w-1/2 animate-pulse rounded bg-slate-100" />
        </div>
      </div>

      <div className="h-10 w-28 animate-pulse rounded-xl bg-slate-100" />
    </div>
  );
}

function EmptyState({ category }: { category: Category }) {
  return (
    <div className="col-span-full flex min-h-[360px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 text-center">
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-sm">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-9 w-9 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M20 13V7a2 2 0 00-2-2h-3.5a2 2 0 01-1.6-.8l-.8-1.066A2 2 0 0010.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h6"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M16 19h6m-3-3v6"
          />
        </svg>
      </div>

      <h3 className="text-xl font-bold text-slate-900">No products found</h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        We could not find any products in{" "}
        <span className="font-medium text-slate-700">
          {CATEGORY_LABELS[category]}
        </span>{" "}
        right now.
      </p>
    </div>
  );
}

export default function Listing() {
  const context = useContext(CategoryContext);

  const [products, setProducts] = useState<Product[]>([]);
  const [firstitem, setfirstitem] = useState<number>(0);
  const [lastitem, setlastitem] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [prevlistid, setprevlistid] = useState<number>(0);

  if (!context) {
    throw new Error("Listing must be used within a Context provider");
  }

  const { category, nextlistid } = context;

  useEffect(() => {
    const handleListing = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await axios.get(
          `/api/product?category=${category}&next=${nextlistid}&prev=${prevlistid}`
        );

        setProducts(
          Array.isArray(res.data.product)
            ? res.data.product
            : res.data.product
            ? [res.data.product]
            : []
        );

        setfirstitem(res.data.firstitem || 0);
        setlastitem(res.data.lastitem || 0);
      } catch (error) {
        console.log(error);
        setError("Something went wrong while fetching products.");
      } finally {
        setLoading(false);
      }
    };

    handleListing();
  }, [category, nextlistid, prevlistid]);

  return (
    <section className="mx-auto mt-24 w-full max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
      <div className="mb-8 rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">
              Products
            </p>

            <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">
              {CATEGORY_LABELS[category]}
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
              Browse the latest products. Since product images are not available,
              each item is shown with a clean text-first product card.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Showing
            </p>

            <p className="mt-1 text-2xl font-black text-slate-900">
              {products.length}
              <span className="ml-1 text-sm font-semibold text-slate-400">
                items
              </span>
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {loading &&
          Array.from({ length: 8 }).map((_, index) => (
            <ProductSkeleton key={index} />
          ))}

        {!loading &&
          products.map((product) => (
            <article
              key={product.id}
              className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-100/60"
            >
              <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-emerald-50 transition-transform duration-300 group-hover:scale-125" />

              <div className="relative z-10">
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-xl font-black text-white shadow-sm">
                    {product.name?.charAt(0)?.toUpperCase() || "P"}
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      CATEGORY_STYLES[product.category] || CATEGORY_STYLES.all
                    }`}
                  >
                    {CATEGORY_LABELS[product.category] || product.category}
                  </span>
                </div>

                <h3 className="min-h-[56px] text-lg font-bold leading-snug text-slate-900 transition-colors group-hover:text-emerald-700">
                  {product.name}
                </h3>

                <div className="mt-6 rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Price
                  </p>

                  <div className="mt-1 flex items-end justify-between gap-3">
                    <p className="text-3xl font-black tracking-tight text-slate-950">
                      ₹{product.pricing}
                    </p>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/edit-product/${product.id}`}
                        className="flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition-all duration-300 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 active:scale-95"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16.862 4.487l1.651-1.651a2.121 2.121 0 013 3l-9.193 9.193a4.5 4.5 0 01-1.897 1.13L7.5 17.25l1.091-2.923a4.5 4.5 0 011.13-1.897l7.141-7.143z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19.5 7.125L16.875 4.5M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                          />
                        </svg>

                        Edit
                      </Link>

                      <button className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white transition-all duration-300 hover:bg-emerald-600 active:scale-95">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                  <span>ID #{product.id}</span>
                  <span>Available</span>
                </div>
              </div>
            </article>
          ))}

        {!loading && products.length === 0 && <EmptyState category={category} />}
      </div>

      {!loading && products.length > 0 && (
        <div className="mt-10">
          <Pagination
            firstitem={firstitem}
            lastitem={lastitem}
            setprevlistid={setprevlistid}
          />
        </div>
      )}
    </section>
  );
}