export type Language = 'en' | 'bn';

export type ServiceCategory =
  | 'all'
  | 'physio'
  | 'hijama'
  | 'acupuncture'
  | 'acupressure'
  | 'speech'
  | 'natural'
  | 'neuro'
  | 'home';

export interface ServiceItem {
  id: string;
  titleEn: string;
  titleBn: string;
  category: ServiceCategory;
  descEn: string;
  descBn: string;
  duration: string;
  durationBn: string;
  priceBdt: number;
  priceNoteEn: string;
  priceNoteBn: string;
  idealForEn: string[];
  idealForBn: string[];
  image: string;
  femaleImage?: string;
  recommendedSessions: string;
  featured?: boolean;
}

export interface Therapist {
  id: string;
  nameEn: string;
  nameBn: string;
  designationEn: string;
  designationBn: string;
  qualificationEn: string;
  qualificationBn: string;
  specialtyEn: string;
  specialtyBn: string;
  specialties: string[];
  bioEn: string;
  bioBn: string;
  experienceYears: number;
  availableDaysEn: string;
  availableDaysBn: string;
  availableHours: string;
  gender: 'male' | 'female';
  rating: number;
  reviewsCount: number;
  consultationFeeBdt: number;
  consultationType: 'clinic' | 'home' | 'both';
  languagesSpoken: string[];
  avatarInitial: string;
  avatarBg: string;
  image?: string;
  isLeadSpecialist?: boolean;
}

export interface Appointment {
  id: string;
  patientName: string;
  patientPhone: string;
  patientAge: string;
  patientGender: 'male' | 'female' | 'other';
  serviceId: string;
  serviceTitle: string;
  therapistId: string;
  therapistName: string;
  visitType: 'center' | 'home';
  upazila: string;
  address?: string;
  date: string;
  timeSlot: string;
  notes?: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  createdAt: string;
  totalBdt: number;
}

export interface SymptomEvaluation {
  bodyPart: string;
  bodyPartBn: string;
  severity: 'mild' | 'moderate' | 'severe';
  duration: string;
  redFlags: boolean;
  recommendedServiceId: string;
  adviceEn: string[];
  adviceBn: string[];
}

export interface Review {
  id: string;
  name: string;
  area: string;
  serviceEn: string;
  serviceBn: string;
  rating: number; // 1 to 5
  date: string;
  textEn: string;
  textBn: string;
  therapistName?: string;
  verified?: boolean;
}

export type ShopCategory =
  | 'all'
  | 'hijama'
  | 'herbal_oils'
  | 'orthopedic'
  | 'devices'
  | 'unani';

export interface ShopProduct {
  id: string;
  nameEn: string;
  nameBn: string;
  category: ShopCategory;
  priceBdt: number;
  originalPriceBdt?: number;
  rating: number;
  reviewsCount: number;
  descEn: string;
  descBn: string;
  benefitsBn: string[];
  usageBn: string;
  image: string;
  inStock: boolean;
  featured?: boolean;
  recommendedFor?: string[];
}

export interface CartItem {
  product: ShopProduct;
  quantity: number;
}

export interface ProductOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  deliveryType: 'pickup' | 'delivery';
  upazila: string;
  deliveryAddress?: string;
  items: CartItem[];
  subtotalBdt: number;
  deliveryFeeBdt: number;
  totalBdt: number;
  paymentMethod: 'cod' | 'bkash' | 'clinic_pickup';
  orderNotes?: string;
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  createdAt: string;
}

export interface PainTherapyCondition {
  id: string;
  titleEn: string;
  titleBn: string;
  subtitleBn: string;
  commonCausesBn: string[];
  symptomsBn: string[];
  effectiveTherapies: {
    serviceId: string;
    therapyNameBn: string;
    howItHelpsBn: string;
    durationBn: string;
  }[];
  therapistAdviceBn: string;
  recommendedProducts: string[];
  image: string;
}
