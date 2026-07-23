import{addDoc,collection,serverTimestamp}from"firebase/firestore";
import{db}from"@/firebase/config";
export type AccessibilityFeature={name:string;status:"detected"|"not_detected"|"unclear";detail:string;impact:"positive"|"neutral"|"barrier"};
export type AccessibilityScan={score:number;summary:string;features:AccessibilityFeature[];recommendations:string[];limitations:string};
export async function saveAccessibilityScan(scan:AccessibilityScan,user:{name:string;email:string}){if(!db)throw Error("Firebase is not configured. Add Firebase values to .env.local.");await addDoc(collection(db,"accessibilityScans"),{...scan,authorId:user.email,authorName:user.name,createdAt:serverTimestamp()})}