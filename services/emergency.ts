export type EmergencyContact={id:string;name:string;phone:string};
const key="sahaya-emergency-contacts";
export function getEmergencyContacts():EmergencyContact[]{if(typeof window==="undefined")return[];try{return JSON.parse(localStorage.getItem(key)||"[]")}catch{return[]}}
export function saveEmergencyContacts(contacts:EmergencyContact[]){localStorage.setItem(key,JSON.stringify(contacts))}