import { 
  collection, addDoc, getDocs, updateDoc, doc 
} from 'firebase/firestore';
import { db } from '../firebase';
import { MaintenanceRequest } from '../types';

const COLLECTION_NAME = 'maintenanceRequests';

export const requestService = {
  // 1. Get All
  getAll: async (): Promise<MaintenanceRequest[]> => {
    const snapshot = await getDocs(collection(db, COLLECTION_NAME));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MaintenanceRequest));
  },

  // 2. Create
  create: async (request: Omit<MaintenanceRequest, 'id'>) => {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), request);
    return { id: docRef.id, ...request };
  },

  // 3. Update Status (NEW)
  updateStatus: async (id: string, newStage: string) => {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, { stage: newStage });
  }
};