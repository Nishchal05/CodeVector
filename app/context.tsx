"use client";

import { createContext, useState, ReactNode } from "react";

type Category = "all" | "MensClothes" | "WomensClothes" | "KidsClothes" | "Shoes";

type CategoryContextType = {
  category: Category;
  setCategory: React.Dispatch<React.SetStateAction<Category>>;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  nextlistid:number;
  setnextlistid:React.Dispatch<React.SetStateAction<number>>;

};

export const CategoryContext = createContext<CategoryContextType | null>(null);

export default function Context({ children }: { children: ReactNode }) {
  const [category, setCategory] = useState<Category>("all");
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [nextlistid,setnextlistid]=useState<number>(0);
  return (
    <CategoryContext.Provider
      value={{
        category,
        setCategory,
        currentPage,
        setCurrentPage,
        nextlistid,
        setnextlistid
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
}