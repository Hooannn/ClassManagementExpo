import { create } from "zustand";

interface DefaultStore {
  count: number;
  inc: () => void;
}

const useDefaultStore = create<DefaultStore>()((set) => ({
  count: 1,
  inc: () => set((state) => ({ count: state.count + 1 })),
}));

export default useDefaultStore;
