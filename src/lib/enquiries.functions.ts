import { createServerFn } from "@tanstack/react-start";
import { enquirySchema } from "./offer";

export const submitEnquiry = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => enquirySchema.parse(input))
  .handler(async ({ data }) => {
    // Public, validated insert only: the privileged client never exposes lead reads.
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("offer_requests").upsert(
      {
        name: data.name,
        phone: data.phone,
        locations: data.locations,
        request_key: data.requestKey,
      },
      { onConflict: "request_key", ignoreDuplicates: true },
    );
    if (error) throw new Error("تعذّر إرسال الطلب الآن، يرجى المحاولة مرة أخرى.");
    return { success: true };
  });
