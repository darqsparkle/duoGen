import { ENQUIRIES, firebaseApp, isFirebaseConfigured } from "./firebase/client";
import type { EnquiryValues } from "./validation";

export type EnquiryResult =
  | { ok: true; delivered: false; message: string }
  | { ok: true; delivered: true; message: string }
  | { ok: false; message: string };

export const enquiriesEnabled = isFirebaseConfigured;

/**
 * Service boundary for project enquiries.
 *
 * Saves the enquiry to Firestore (collection "enquiries"). Firestore rules allow
 * the public to create well-formed enquiries only; reading them requires the
 * admin sign-in on /admin. Without Firebase config the form stays a demo and
 * nothing is sent.
 *
 * `honeypot` is a hidden field real visitors never fill in; bots usually do.
 * Those submissions are silently dropped.
 */
export async function submitEnquiry(values: EnquiryValues, honeypot = ""): Promise<EnquiryResult> {
  if (!enquiriesEnabled) {
    await new Promise((resolve) => setTimeout(resolve, 900));
    return {
      ok: true,
      delivered: false,
      message:
        "Thanks for your interest in DuoGen Tech Solutions. This is a frontend demo, so your enquiry has not been sent or stored.",
    };
  }

  const received = {
    ok: true,
    delivered: true,
    message:
      "Thanks for reaching out to DuoGen Tech Solutions. We've received your enquiry and will get back to you soon.",
  } as const;
  if (honeypot.trim()) return received;

  try {
    // Loaded on submit so the Firebase SDK never slows down the page itself.
    const { addDoc, collection, getFirestore, serverTimestamp } = await import("firebase/firestore");
    const db = getFirestore(firebaseApp());
    await addDoc(collection(db, ENQUIRIES), {
      fullName: values.fullName.trim(),
      email: values.email.trim(),
      company: values.company.trim(),
      phone: values.phone.trim(),
      industry: values.industry,
      services: values.services,
      // No longer asked for, but the Firestore rules still expect the field.
      budget: "",
      description: values.description.trim(),
      // Comma-joined without spaces so all three fit the rules' 20-character limit.
      contactMethod: values.contactMethods.join(","),
      consent: values.consent,
      status: "new",
      createdAt: serverTimestamp(),
    });
    return received;
  } catch (error) {
    console.error("[enquiry] could not save", error);
    return {
      ok: false,
      message: "Sorry, we couldn't send your enquiry just now. Please check your connection and try again.",
    };
  }
}
