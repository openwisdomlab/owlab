import { describe, it, expect, beforeEach } from 'vitest';
import { useLearningProgressStore } from '../learning-progress-store';

// Helper to reset the store between tests
function resetStore() {
  useLearningProgressStore.getState().resetProgress();
}

describe('learning-progress-store', () => {
  beforeEach(() => {
    localStorage.clear();
    resetStore();
  });

  // --- markProgress ---
  it('markProgress increments dimension value for a module', () => {
    const store = useLearningProgressStore.getState();
    store.markProgress('M01', 'enlighten', 25);
    expect(useLearningProgressStore.getState().moduleProgress.M01.enlighten).toBe(25);
  });

  it('markProgress clamps at 100', () => {
    const store = useLearningProgressStore.getState();
    store.markProgress('M01', 'enlighten', 80);
    store.markProgress('M01', 'enlighten', 50);
    expect(useLearningProgressStore.getState().moduleProgress.M01.enlighten).toBe(100);
  });

  it('markProgress clamps at 0 for negative overflow', () => {
    const store = useLearningProgressStore.getState();
    store.markProgress('M01', 'enlighten', -10);
    expect(useLearningProgressStore.getState().moduleProgress.M01.enlighten).toBe(0);
  });

  // --- setModuleProgress ---
  it('setModuleProgress sets exact value', () => {
    const store = useLearningProgressStore.getState();
    store.setModuleProgress('M05', 'empower', 42);
    expect(useLearningProgressStore.getState().moduleProgress.M05.empower).toBe(42);
  });

  it('setModuleProgress clamps values to 0-100 range', () => {
    const store = useLearningProgressStore.getState();
    store.setModuleProgress('M05', 'empower', 150);
    expect(useLearningProgressStore.getState().moduleProgress.M05.empower).toBe(100);

    store.setModuleProgress('M05', 'empower', -20);
    expect(useLearningProgressStore.getState().moduleProgress.M05.empower).toBe(0);
  });

  // --- getDimensionProgress ---
  it('getDimensionProgress returns average across deck modules', () => {
    const store = useLearningProgressStore.getState();
    // enlighten deck = M01, M02, M03
    store.setModuleProgress('M01', 'enlighten', 30);
    store.setModuleProgress('M02', 'enlighten', 60);
    store.setModuleProgress('M03', 'enlighten', 90);

    const progress = useLearningProgressStore.getState().getDimensionProgress('enlighten');
    expect(progress).toBe(60); // (30+60+90)/3
  });

  it('getDimensionProgress returns 0 when no progress set', () => {
    const progress = useLearningProgressStore.getState().getDimensionProgress('engage');
    expect(progress).toBe(0);
  });

  // --- getOverallProgress ---
  it('getOverallProgress returns 0 initially', () => {
    const progress = useLearningProgressStore.getState().getOverallProgress();
    expect(progress).toBe(0);
  });

  it('getOverallProgress averages all 27 cells (9 modules x 3 dimensions)', () => {
    const store = useLearningProgressStore.getState();
    // Set every cell to 50
    const modules = ['M01', 'M02', 'M03', 'M04', 'M05', 'M06', 'M07', 'M08', 'M09'] as const;
    const dims = ['enlighten', 'empower', 'engage'] as const;
    for (const m of modules) {
      for (const d of dims) {
        store.setModuleProgress(m, d, 50);
      }
    }
    const progress = useLearningProgressStore.getState().getOverallProgress();
    expect(progress).toBe(50);
  });

  // --- resetProgress ---
  it('resetProgress zeros all modules', () => {
    const store = useLearningProgressStore.getState();
    store.setModuleProgress('M01', 'enlighten', 75);
    store.setModuleProgress('M09', 'engage', 100);

    store.resetProgress();

    const state = useLearningProgressStore.getState();
    expect(state.moduleProgress.M01.enlighten).toBe(0);
    expect(state.moduleProgress.M09.engage).toBe(0);
    expect(state.getOverallProgress()).toBe(0);
  });

  // --- importChecklistProgress ---
  it('importChecklistProgress maps checklist ID to correct module', () => {
    const store = useLearningProgressStore.getState();
    store.importChecklistProgress('m04-core', 3, 10);

    // M04 is in empower deck
    const state = useLearningProgressStore.getState();
    expect(state.moduleProgress.M04.empower).toBe(30); // 3/10 = 30%
  });

  it('importChecklistProgress ignores invalid IDs', () => {
    const store = useLearningProgressStore.getState();
    store.importChecklistProgress('invalid-id', 5, 10);
    // Nothing should change
    expect(useLearningProgressStore.getState().getOverallProgress()).toBe(0);
  });

  // --- lastUpdated ---
  it('lastUpdated is refreshed on every state change', () => {
    const before = useLearningProgressStore.getState().lastUpdated;
    useLearningProgressStore.getState().markProgress('M01', 'enlighten', 10);
    const after = useLearningProgressStore.getState().lastUpdated;
    expect(after).toBeGreaterThanOrEqual(before);
  });
});
