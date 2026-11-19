import { describe, it, expect } from "vitest";
import { OFFER, enquirySchema, offerActive, daysRemaining } from "@/lib/offer";

describe("Campaign rules", () => {
  it("applies a 10 percent campaign discount", () => expect(OFFER.discount).toBe(10));
  it("ends at the end of December 31 in Palestine", () => {
    expect(offerActive(new Date("2026-12-31T21:59:59Z"))).toBe(true);
    expect(offerActive(new Date("2026-12-31T22:00:00Z"))).toBe(false);
    expect(daysRemaining(new Date("2027-01-02"))).toBe(0);
  });
  it("offers installments up to five years", () => expect(OFFER.installmentsYears).toBe(5));
  it("uses 5000 dollars for Qarawa and Farkha", () => {
    expect(OFFER.locations.slice(0, 2).map((x) => [x.deposit, x.currency])).toEqual([
      [5000, "دولار"],
      [5000, "دولار"],
    ]);
  });
  it("uses 5000 dinars for Mazraa", () =>
    expect([OFFER.locations[2].deposit, OFFER.locations[2].currency]).toEqual([5000, "دينار"]));
  it("accepts Palestinian and Jerusalem mobile formats, rejects invalid numbers", () => {
    const data = {
      name: "اسم تجريبي",
      locations: [],
      website: "",
      requestKey: "11111111-1111-4111-8111-111111111111",
    };
    for (const phone of ["0591234567", "٠٥٩١٢٣٤٥٦٧", "+970 59 123 4567", "+972 50 123 4567"])
      expect(enquirySchema.safeParse({ ...data, phone }).success).toBe(true);
    for (const phone of ["12345", "05abc12345678", "0491234567"])
      expect(enquirySchema.safeParse({ ...data, phone }).success).toBe(false);
  });
});
