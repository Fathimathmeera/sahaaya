import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "@/firebase/config";
export async function submitCommunityReport(input: { placeName: string; review: string; rating: number; image?: File; authorName: string; authorId: string }) {
  if (!db) throw new Error("Firebase is not configured. Add your Firebase values to .env.local.");
  let imageUrl: string | undefined;
  if (input.image) { if (!storage) throw new Error("Firebase Storage is not configured."); const imageRef = ref(storage, `reports/${input.authorId}/${Date.now()}-${input.image.name}`); await uploadBytes(imageRef, input.image); imageUrl = await getDownloadURL(imageRef); }
  await addDoc(collection(db, "communityReports"), { placeName: input.placeName, review: input.review, rating: input.rating, imageUrl, authorName: input.authorName, authorId: input.authorId, createdAt: serverTimestamp() });
}
