// types.ts
export interface HeaderProps {
  activeView: string;
  viewMode: string;
  onViewChange: (view: string) => void;
  onViewModeChange: (mode: string) => void;
  patientCounts: {
    active: number;
    archive: number;
  };
  onAddPatient?: () => void;
  onFilterClick?: () => void;
}


export interface Patient {
  id: string;
  image?: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  gender: "male"| "female";
  email?: string;
  address?: string;
  lastVisit: Date;
  creared_at: Date;
}

export interface AddModalProps {
  isVisible: boolean;
  closeModal: () => void;
}