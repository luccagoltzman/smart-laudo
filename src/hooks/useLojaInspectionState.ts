import { useCallback, useState } from 'react';
import { getInitialLojaSections } from '../data/checklistLojaSections';
import type { InspectionState, VehicleIdentification } from '../types/checklist.types';
import { calculateRiskScore, getRiskLevel } from '../utils/riskScore';

const STORAGE_KEY = 'smart-laudo-loja-inspection';

const defaultVehicle: VehicleIdentification = {
  plate: '',
  renavam: '',
  chassi: '',
  brand: '',
  model: '',
  year: '',
  version: '',
  color: '',
  km: '',
};

function loadFromStorage(): InspectionState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as InspectionState;
    if (parsed?.sections) return parsed;
  } catch {
    // ignore
  }
  return null;
}

function saveToStorage(state: InspectionState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function useLojaInspectionState() {
  const [state, setState] = useState<InspectionState>(() => {
    const saved = loadFromStorage();
    if (saved) return saved;
    return {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      vehicle: { ...defaultVehicle },
      sections: getInitialLojaSections(),
      riskLevel: 'low',
      riskScore: 0,
    };
  });

  const updateVehicle = useCallback((vehicle: Partial<VehicleIdentification>) => {
    setState((prev) => {
      const next = {
        ...prev,
        vehicle: { ...prev.vehicle, ...vehicle },
      };
      saveToStorage(next);
      return next;
    });
  }, []);

  const updateItemStatus = useCallback(
    (sectionId: string, itemId: string, status: InspectionState['sections'][0]['items'][0]['status'], observation?: string) => {
      setState((prev) => {
        const sections = prev.sections.map((sec) => {
          if (sec.id !== sectionId) return sec;
          return {
            ...sec,
            items: sec.items.map((item) =>
              item.id !== itemId
                ? item
                : { ...item, status, observation: observation ?? item.observation }
            ),
          };
        });
        const riskScore = calculateRiskScore(sections);
        const riskLevel = getRiskLevel(riskScore);
        const next = { ...prev, sections, riskScore, riskLevel };
        saveToStorage(next);
        return next;
      });
    },
    []
  );

  const addObservation = useCallback((sectionId: string, itemId: string, observation: string) => {
    setState((prev) => {
      const sections = prev.sections.map((sec) => {
        if (sec.id !== sectionId) return sec;
        return {
          ...sec,
          items: sec.items.map((item) =>
            item.id !== itemId ? item : { ...item, observation }
          ),
        };
      });
      const next = { ...prev, sections };
      saveToStorage(next);
      return next;
    });
  }, []);

  const updateItemPhotos = useCallback((sectionId: string, itemId: string, photos: string[]) => {
    setState((prev) => {
      const sections = prev.sections.map((sec) => {
        if (sec.id !== sectionId) return sec;
        return {
          ...sec,
          items: sec.items.map((item) =>
            item.id !== itemId ? item : { ...item, photos }
          ),
        };
      });
      const next = { ...prev, sections };
      saveToStorage(next);
      return next;
    });
  }, []);

  const setSignature = useCallback((signatureDataUrl: string | undefined) => {
    setState((prev) => {
      const next = { ...prev, signatureDataUrl };
      saveToStorage(next);
      return next;
    });
  }, []);

  const startNewInspection = useCallback(() => {
    const next: InspectionState = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      vehicle: { ...defaultVehicle },
      sections: getInitialLojaSections(),
      riskLevel: 'low',
      riskScore: 0,
      signatureDataUrl: undefined,
    };
    setState(next);
    saveToStorage(next);
  }, []);

  /** Inicia uma nova inspeção com os dados do veículo já preenchidos (ex.: vindos da API). */
  const startInspectionWithVehicle = useCallback((vehicle: VehicleIdentification) => {
    const next: InspectionState = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      vehicle: { ...defaultVehicle, ...vehicle },
      sections: getInitialLojaSections(),
      riskLevel: 'low',
      riskScore: 0,
      signatureDataUrl: undefined,
    };
    setState(next);
    saveToStorage(next);
  }, []);

  return {
    state,
    updateVehicle,
    updateItemStatus,
    addObservation,
    updateItemPhotos,
    setSignature,
    startNewInspection,
    startInspectionWithVehicle,
  };
}
