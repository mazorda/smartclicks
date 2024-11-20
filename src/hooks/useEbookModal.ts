import { create } from 'zustand';

interface EbookModalStore {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const useEbookModal = create<EbookModalStore>((set) => ({
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
}));