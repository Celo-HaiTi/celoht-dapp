import { courses } from "../../courses.ts";

export type AcademyCertificateRecord = {
  id: string;
  courseId: string;
  title: string;
  studentId: string;
  issuedAt: string;
};

export type AcademyState = {
  studentId: string;
  enrolledCourseIds: string[];
  completedCourseIds: string[];
  certificateRecords: AcademyCertificateRecord[];
  updatedAt: string;
};

export type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

const STORAGE_PREFIX = "celoht-academy-state";
const fallbackStateCache = new Map<string, AcademyState>();
const stateCache = new WeakMap<StorageLike, Map<string, AcademyState>>();

function sameAcademyState(left: AcademyState, right: AcademyState) {
  return left.studentId === right.studentId &&
    left.enrolledCourseIds.length === right.enrolledCourseIds.length &&
    left.enrolledCourseIds.every((courseId, index) => courseId === right.enrolledCourseIds[index]) &&
    left.completedCourseIds.length === right.completedCourseIds.length &&
    left.completedCourseIds.every((courseId, index) => courseId === right.completedCourseIds[index]) &&
    left.certificateRecords.length === right.certificateRecords.length &&
    left.certificateRecords.every((record, index) => {
      const other = right.certificateRecords[index];
      return !!other &&
        record.id === other.id &&
        record.courseId === other.courseId &&
        record.title === other.title &&
        record.studentId === other.studentId &&
        record.issuedAt === other.issuedAt;
    });
}

function getStateCache(storage: StorageLike) {
  if (!stateCache.has(storage)) {
    stateCache.set(storage, new Map());
  }

  return stateCache.get(storage)!;
}

export function createMemoryStorage(): StorageLike {
  const store = new Map<string, string>();
  return {
    getItem(key: string) {
      return store.has(key) ? store.get(key)! : null;
    },
    setItem(key: string, value: string) {
      store.set(key, String(value));
    },
    removeItem(key: string) {
      store.delete(key);
    },
  };
}

function getStorage(storage?: StorageLike): StorageLike | undefined {
  if (storage) return storage;
  if (typeof window === "undefined") return undefined;
  return window.localStorage;
}

export function studentKey(studentId = "guest") {
  return `${STORAGE_PREFIX}:${studentId.toLowerCase()}`;
}

const defaultState = (studentId = "guest"): AcademyState => ({
  studentId: studentId.toLowerCase(),
  enrolledCourseIds: [],
  completedCourseIds: [],
  certificateRecords: [],
  updatedAt: new Date().toISOString(),
});

export function getAcademyState(storage?: StorageLike, studentId = "guest"): AcademyState {
  const store = getStorage(storage);
  const key = studentKey(studentId);
  const raw = store?.getItem(key) ?? null;
  const cache = store ? getStateCache(store) : fallbackStateCache;

  if (!raw) {
    const defaultValue = defaultState(studentId);
    const cached = cache.get(key);
    if (cached && sameAcademyState(cached, defaultValue)) return cached;
    cache.set(key, defaultValue);
    return defaultValue;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<AcademyState>;
    const normalized = {
      studentId: (parsed.studentId ?? studentId).toLowerCase(),
      enrolledCourseIds: Array.isArray(parsed.enrolledCourseIds) ? parsed.enrolledCourseIds.filter((courseId): courseId is string => typeof courseId === "string") : [],
      completedCourseIds: Array.isArray(parsed.completedCourseIds) ? parsed.completedCourseIds.filter((courseId): courseId is string => typeof courseId === "string") : [],
      certificateRecords: Array.isArray(parsed.certificateRecords) ? parsed.certificateRecords.filter((record): record is AcademyCertificateRecord => !!record && typeof record.courseId === "string" && typeof record.id === "string") : [],
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : new Date().toISOString(),
    };

    const cached = cache.get(key);
    if (cached && sameAcademyState(cached, normalized)) return cached;
    cache.set(key, normalized);

    return normalized;
  } catch {
    const fallback = defaultState(studentId);
    const cached = cache.get(key);
    if (cached && sameAcademyState(cached, fallback)) return cached;
    cache.set(key, fallback);
    return fallback;
  }
}

export function writeAcademyState(state: AcademyState, storage?: StorageLike) {
  const store = getStorage(storage);
  const key = studentKey(state.studentId);
  const normalized = {
    ...state,
    studentId: state.studentId.toLowerCase(),
    enrolledCourseIds: [...new Set(state.enrolledCourseIds)],
    completedCourseIds: [...new Set(state.completedCourseIds)],
    updatedAt: new Date().toISOString(),
  };

  if (!store) {
    fallbackStateCache.set(key, normalized);
    return normalized;
  }

  const cache = getStateCache(store);
  cache.delete(key);
  store.setItem(key, JSON.stringify(normalized));
  cache.set(key, normalized);
  return normalized;
}

export function enrollCourse(courseId: string, storage?: StorageLike, studentId = "guest") {
  const state = getAcademyState(storage, studentId);
  if (!courseId || !state) return false;
  if (state.enrolledCourseIds.includes(courseId)) {
    return true;
  }

  const next = writeAcademyState({
    ...state,
    studentId: studentId.toLowerCase(),
    enrolledCourseIds: [...state.enrolledCourseIds, courseId],
  }, storage);
  return next.enrolledCourseIds.includes(courseId);
}

export function markCourseComplete(courseId: string, storage?: StorageLike, studentId = "guest") {
  const state = getAcademyState(storage, studentId);
  const course = courses.find((item) => item.id === courseId);

  if (!course || state.completedCourseIds.includes(courseId)) {
    return state.completedCourseIds.includes(courseId);
  }

  const nextState: AcademyState = {
    ...state,
    studentId: studentId.toLowerCase(),
    enrolledCourseIds: [...new Set([...state.enrolledCourseIds, courseId])],
    completedCourseIds: [...new Set([...state.completedCourseIds, courseId])],
    certificateRecords: [
      ...state.certificateRecords.filter((record) => record.courseId !== courseId),
      {
        id: `certificate-${courseId}-${studentId.toLowerCase()}`,
        courseId,
        title: course.title,
        studentId: studentId.toLowerCase(),
        issuedAt: new Date().toISOString(),
      },
    ],
  };

  writeAcademyState(nextState, storage);
  return true;
}

export function getCertificateRecords(storage?: StorageLike, studentId = "guest") {
  return getAcademyState(storage, studentId).certificateRecords;
}

export function getCompletedCourseIds(storage?: StorageLike, studentId = "guest") {
  return getAcademyState(storage, studentId).completedCourseIds;
}
