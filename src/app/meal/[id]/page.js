// src/app/item/[id]/page.tsx
import { notFound } from "next/navigation";
import { styles } from "@/styles/details.module.css";

export default async function MealPage({ params }) {
  const id = (await params).id;
  // fetch data...
//   if (!id) {
//     notFound();
//   }
  return (
    <div className="fullPageDetail">
      <h1>Item: {id} (full page)</h1>
      {/* …details… */}
    </div>
  );
}
