export type AccessibilityType="Ramp"|"Elevator"|"Accessible Toilet"|"Parking";
export type ReportStatus="accessible"|"inaccessible";
export interface CommunityReport{id:string;placeName:string;comment:string;rating:number;accessibilityType:AccessibilityType;status:ReportStatus;imageUrl?:string;authorName:string;authorId:string;latitude?:number;longitude?:number;createdAt?:{seconds:number};summary?:string;}
export interface Profile{name:string;email:string;phone:string;emergencyContact:string;wheelchairType:string;}