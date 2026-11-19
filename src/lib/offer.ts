import { z } from "zod";

export const OFFER = {
  discount: 10,
  deadline: "2026-12-31T23:59:59+02:00",
  installmentsYears: 5,
  locations: [
    {
      id: "qarawa",
      name: "قراوة بني زيد",
      region: "محافظة رام الله",
      area: "1000–1500",
      deposit: 5000,
      currency: "دولار",
      classification: "تصنيف (أ)",
      description: "إطلالات على كروم الزيتون والتلال الفلسطينية.",
    },
    {
      id: "farkha",
      name: "فرخة",
      region: "محافظة سلفيت",
      area: "1000–1500",
      deposit: 5000,
      currency: "دولار",
      classification: "تصنيف (أ)",
      description: "طبيعة خضراء وإطلالات مرتفعة مفتوحة.",
    },
    {
      id: "mazraa",
      name: "المزرعة الغربية",
      region: "حوالي 10 كم عن مركز رام الله",
      area: "500–700",
      deposit: 5000,
      currency: "دينار",
      classification: "",
      description: "إطلالة جبلية وموقع قريب من مدينة رام الله.",
    },
  ],
} as const;

export function normalizePhone(value: string) {
  return value
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)))
    .replace(/[\s()+-]/g, "")
    .replace(/^00/, "");
}
export const enquirySchema = z.object({
  name: z.string().trim().min(2, "يرجى إدخال اسمك").max(100),
  phone: z
    .string()
    .transform(normalizePhone)
    .refine(
      (v) => /^(05\d{8}|97[02]5\d{8})$/.test(v),
      "أدخل رقم جوال صحيحًا يبدأ بـ 05 أو +970 أو +972",
    ),
  locations: z.array(z.enum(["qarawa", "farkha", "mazraa"])).max(3),
  requestKey: z.string().uuid(),
  website: z.string().max(0),
});

export function offerActive(now: Date) {
  return now.getTime() <= new Date(OFFER.deadline).getTime();
}
export function daysRemaining(now: Date) {
  return Math.max(0, Math.ceil((new Date(OFFER.deadline).getTime() - now.getTime()) / 86400000));
}
