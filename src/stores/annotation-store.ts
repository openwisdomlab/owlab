import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";

export interface Reply {
  id: string;
  author: string;
  role: "mentor" | "student";
  content: string;
  createdAt: string;
}

export interface Annotation {
  id: string;
  pageId: string;
  selectedText: string;
  comment: string;
  author: string;
  role: "mentor" | "student";
  createdAt: string;
  resolved: boolean;
  replies: Reply[];
}

type FilterStatus = "all" | "resolved" | "unresolved";

interface AnnotationState {
  annotations: Annotation[];
  isPanelOpen: boolean;
  activeAnnotationId: string | null;
  filterStatus: FilterStatus;

  // Panel
  togglePanel: () => void;
  openPanel: () => void;
  closePanel: () => void;

  // Active annotation
  setActiveAnnotation: (id: string | null) => void;

  // Filter
  setFilterStatus: (status: FilterStatus) => void;

  // CRUD
  addAnnotation: (
    annotation: Omit<Annotation, "id" | "createdAt" | "resolved" | "replies">
  ) => string;
  updateAnnotation: (id: string, updates: Partial<Pick<Annotation, "comment" | "selectedText">>) => void;
  deleteAnnotation: (id: string) => void;
  resolveAnnotation: (id: string) => void;
  unresolveAnnotation: (id: string) => void;

  // Replies
  addReply: (annotationId: string, reply: Omit<Reply, "id" | "createdAt">) => void;
  deleteReply: (annotationId: string, replyId: string) => void;

  // Selectors
  getAnnotationsForPage: (pageId: string) => Annotation[];
  getFilteredAnnotations: (pageId: string) => Annotation[];
}

export const useAnnotationStore = create<AnnotationState>()(
  persist(
    (set, get) => ({
      annotations: [],
      isPanelOpen: false,
      activeAnnotationId: null,
      filterStatus: "all" as FilterStatus,

      // Panel
      togglePanel: () => set((state) => ({ isPanelOpen: !state.isPanelOpen })),
      openPanel: () => set({ isPanelOpen: true }),
      closePanel: () => set({ isPanelOpen: false }),

      // Active annotation
      setActiveAnnotation: (id) => set({ activeAnnotationId: id }),

      // Filter
      setFilterStatus: (status) => set({ filterStatus: status }),

      // CRUD
      addAnnotation: (annotation) => {
        const id = uuidv4();
        const newAnnotation: Annotation = {
          ...annotation,
          id,
          createdAt: new Date().toISOString(),
          resolved: false,
          replies: [],
        };
        set((state) => ({
          annotations: [newAnnotation, ...state.annotations],
        }));
        return id;
      },

      updateAnnotation: (id, updates) => {
        set((state) => ({
          annotations: state.annotations.map((a) =>
            a.id === id ? { ...a, ...updates } : a
          ),
        }));
      },

      deleteAnnotation: (id) => {
        set((state) => ({
          annotations: state.annotations.filter((a) => a.id !== id),
          activeAnnotationId:
            state.activeAnnotationId === id ? null : state.activeAnnotationId,
        }));
      },

      resolveAnnotation: (id) => {
        set((state) => ({
          annotations: state.annotations.map((a) =>
            a.id === id ? { ...a, resolved: true } : a
          ),
        }));
      },

      unresolveAnnotation: (id) => {
        set((state) => ({
          annotations: state.annotations.map((a) =>
            a.id === id ? { ...a, resolved: false } : a
          ),
        }));
      },

      // Replies
      addReply: (annotationId, reply) => {
        const newReply: Reply = {
          ...reply,
          id: uuidv4(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          annotations: state.annotations.map((a) =>
            a.id === annotationId
              ? { ...a, replies: [...a.replies, newReply] }
              : a
          ),
        }));
      },

      deleteReply: (annotationId, replyId) => {
        set((state) => ({
          annotations: state.annotations.map((a) =>
            a.id === annotationId
              ? { ...a, replies: a.replies.filter((r) => r.id !== replyId) }
              : a
          ),
        }));
      },

      // Selectors
      getAnnotationsForPage: (pageId) => {
        return get().annotations.filter((a) => a.pageId === pageId);
      },

      getFilteredAnnotations: (pageId) => {
        const { annotations, filterStatus } = get();
        const pageAnnotations = annotations.filter((a) => a.pageId === pageId);
        if (filterStatus === "all") return pageAnnotations;
        if (filterStatus === "resolved")
          return pageAnnotations.filter((a) => a.resolved);
        return pageAnnotations.filter((a) => !a.resolved);
      },
    }),
    {
      name: "owl-annotations",
      partialize: (state) => ({
        annotations: state.annotations,
      }),
    }
  )
);
