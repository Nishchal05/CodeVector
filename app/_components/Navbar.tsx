"use client";

import { useContext, useEffect } from "react"
import Context, { CategoryContext } from "../context"
import Link from "next/link";
type Category = "all"|"MensClothes"|"WomensClothes"|"KidsClothes"|"Shoes";
export default function Navbar(){
    const context = useContext(CategoryContext);
    if (!context) {
        throw new Error("Navbar must be used within a Context provider");
    }
    const {category,setCategory,setCurrentPage} = context;
    return(
        <nav className="h-[65px] w-full flex justify-evenly items-center bg-white/5 backdrop-blur-2xl">
            <span className="bg-gradient-to-r from-green-400 via-green-700 to-green-900 bg-clip-text text-transparent text-2xl">CodeVector</span>
            <select value={category} onChange={(e)=>{setCategory(e.target.value as Category); setCurrentPage(0)}} className="border-none text-black bg-gray-400 p-2 rounded-xl">
                <option value="all">All</option>
                <option value="MensClothes">Men's Clothes</option>
                <option value="WomensClothes">Women's Clothes</option> 
                <option value="KidsClothes">Kid's Clothes</option>
                <option value="Shoes">Shoes</option>
            </select>
            <Link href="/add-product" className="rounded-2xl bg-slate-950 px-6 py-4 text-sm font-bold text-white transition-all hover:bg-emerald-600 active:scale-95">
                Add Product
            </Link>
        </nav>
    )
}