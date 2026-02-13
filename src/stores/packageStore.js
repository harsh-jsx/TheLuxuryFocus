import { create } from "zustand";

export const useSelectedPackageOptionStore = create((set) => ({
    selectedPackageOption: null,
    setSelectedPackageOption: (packageOption) => set({ selectedPackageOption: packageOption }),
}));