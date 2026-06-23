// prisma/seed.ts

import "dotenv/config";
import { Category } from "../app/generated/prisma/client";
import { prisma } from "../lib/prisma";

const mensProducts = [
  "Men Cotton Shirt",
  "Men Denim Jeans",
  "Men Black Hoodie",
  "Men Formal Shirt",
  "Men Polo T-Shirt",
  "Men Cargo Pants",
  "Men Track Pants",
  "Men Leather Jacket",
  "Men Kurta",
  "Men Blazer",
];

const womensProducts = [
  "Women Floral Dress",
  "Women Cotton Kurti",
  "Women Denim Jacket",
  "Women Crop Top",
  "Women Palazzo",
  "Women Saree",
  "Women Leggings",
  "Women Blazer",
  "Women Maxi Dress",
  "Women Skirt",
];

const kidsProducts = [
  "Kids Cotton T-Shirt",
  "Kids Denim Shorts",
  "Kids Hoodie",
  "Kids Party Wear",
  "Kids School Uniform",
  "Kids Pajama Set",
  "Kids Winter Jacket",
  "Kids Track Suit",
  "Kids Frock",
  "Kids Ethnic Wear",
];

const shoesProducts = [
  "Running Shoes",
  "Casual Sneakers",
  "Formal Shoes",
  "Sports Shoes",
  "Leather Boots",
  "Canvas Shoes",
  "Walking Shoes",
  "Training Shoes",
  "Sandals",
  "Loafers",
];

function getRandomPrice(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateProducts() {
  const products: {
    name: string;
    category: Category;
    pricing: number;
  }[] = [];

  for (let i = 1; i <= 5000; i++) {
    products.push({
      name: `${mensProducts[i % mensProducts.length]} ${i}`,
      category: Category.MensClothes,
      pricing: getRandomPrice(499, 3999),
    });
  }

  for (let i = 1; i <= 5000; i++) {
    products.push({
      name: `${womensProducts[i % womensProducts.length]} ${i}`,
      category: Category.WomensClothes,
      pricing: getRandomPrice(399, 4999),
    });
  }

  for (let i = 1; i <= 5000; i++) {
    products.push({
      name: `${kidsProducts[i % kidsProducts.length]} ${i}`,
      category: Category.KidsClothes,
      pricing: getRandomPrice(299, 2499),
    });
  }

  for (let i = 1; i <= 5000; i++) {
    products.push({
      name: `${shoesProducts[i % shoesProducts.length]} ${i}`,
      category: Category.Shoes,
      pricing: getRandomPrice(699, 5999),
    });
  }

  return products;
}

async function main() {
  const products = generateProducts();

  const batchSize = 1000;

  for (let i = 0; i < products.length; i += batchSize) {
    const batch = products.slice(i, i + batchSize);

    await prisma.product.createMany({
      data: batch,
    });

    console.log(`Inserted ${i + batch.length} products`);
  }

  console.log("20,000 products added successfully");
}

main()
  .catch((error) => {
    console.error(error);
  })
  .finally(async () => {
    prisma.$disconnect();
  });