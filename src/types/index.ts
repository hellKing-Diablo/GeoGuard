export type PriorityLevel = 'Low' | 'Medium' | 'High';
export type MaintenanceType = 'Corrective' | 'Preventive';
export type RequestStage = 'New Request' | 'In Progress' | 'Repaired' | 'Scrap';

// --- USERS ---
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Technician' | 'Portal User';
}

// --- MAINTENANCE TEAMS ---
export interface Team {
  id: string;
  name: string;
  members: string[];
  company: string;
}

// --- EQUIPMENT & WORK CENTERS ---
export interface Equipment {
  id: string;
  name: string;
  category: string;
  company: string;
  
  // Optional fields (marked with ?) so "New" forms don't break
  serialNumber?: string;
  technician?: string;
  employee?: string;
  department?: string;
  usedBy?: string;
  maintenanceTeam?: string;
  assignedDate?: string;
  scrapDate?: string;
  location?: string;
  workCenter?: string;
  description?: string;
}

export interface WorkCenter {
  id: string;
  name: string;
  code: string;
  tag: string;
  alternativeWorkcenter: string;
  costPerHour: number;
  capacityEfficiency: number;
  oeeTarget: number;
}

// --- MAINTENANCE REQUESTS ---
export interface MaintenanceRequest {
  id: string;
  subject: string;
  createdBy: string;
  maintenanceFor: 'Equipment' | 'Work Center';
  equipmentId: string; // Stores ID or Name
  category: string;
  requestDate: string;
  type: MaintenanceType;
  teamId: string;
  technicianId: string;
  scheduledDate: string;
  duration: number;
  priority: PriorityLevel;
  company: string;
  stage: RequestStage;
  
  // Optional content
  notes?: string;
  instructions?: string;
}