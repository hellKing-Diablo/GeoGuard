import { 
  collection, addDoc, getDocs, updateDoc, deleteDoc, doc 
} from 'firebase/firestore';
import { db } from '../firebase';
import { Equipment, WorkCenter } from '../types';

const EQUIP_COLLECTION = 'equipment';
const WC_COLLECTION = 'workCenters';

export const equipmentService = {
  // --- EQUIPMENT ---
  getAllEquipment: async (): Promise<Equipment[]> => {
    const snapshot = await getDocs(collection(db, EQUIP_COLLECTION));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Equipment));
  },

  createEquipment: async (data: Omit<Equipment, 'id'>) => {
    const docRef = await addDoc(collection(db, EQUIP_COLLECTION), data);
    return { id: docRef.id, ...data };
  },

  updateEquipment: async (data: Equipment) => {
    const docRef = doc(db, EQUIP_COLLECTION, data.id);
    await updateDoc(docRef, { ...data });
  },

  deleteEquipment: async (id: string) => {
    const docRef = doc(db, EQUIP_COLLECTION, id);
    await deleteDoc(docRef);
  },

  // --- WORK CENTERS ---
  getAllWorkCenters: async (): Promise<WorkCenter[]> => {
    const snapshot = await getDocs(collection(db, WC_COLLECTION));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WorkCenter));
  },

  createWorkCenter: async (data: Omit<WorkCenter, 'id'>) => {
    const docRef = await addDoc(collection(db, WC_COLLECTION), data);
    return { id: docRef.id, ...data };
  },

  updateWorkCenter: async (data: WorkCenter) => {
    const docRef = doc(db, WC_COLLECTION, data.id);
    await updateDoc(docRef, { ...data });
  },

  deleteWorkCenter: async (id: string) => {
    const docRef = doc(db, WC_COLLECTION, id);
    await deleteDoc(docRef);
  }
};