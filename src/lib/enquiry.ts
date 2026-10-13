import type { EnquiryValues } from "./validation";

export type EnquiryResult =
  | { ok: true; delivered: false; message: string }
  | { ok: true; delivered: true; message: string }
  | { ok: false; message: string };

/**
 * Service boundary for project enquiries.
 *
 * This is a frontend-only build: the payload is never transmitted, stored, or
 * logged. To connect a backend later, replace the body of this function with a
 * call to a Route Handler or Server Action and return `delivered: true` only
 * once the backend has confirmed receipt.
 */
export async function submitEnquiry(values: EnquiryValues): Promise<EnquiryResult> {
  void values;
  await new Promise((resolve) => setTimeout(resolve, 900));
  return {
    ok: true,
    delivered: false,
    message:
      "Thanks for your interest in DuoGen Tech Solutions. This is a frontend demo, so your enquiry has not been sent or stored.",
  };
}
