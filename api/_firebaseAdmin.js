import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

let cachedServices = null;

function readEnv() {
  return {
    projectId: String(process.env.FIREBASE_PROJECT_ID || '').trim(),
    clientEmail: String(process.env.FIREBASE_CLIENT_EMAIL || '').trim(),
    privateKey: String(process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n').trim(),
  };
}

export function isAdminConfigured() {
  const { projectId, clientEmail, privateKey } = readEnv();
  return Boolean(projectId && clientEmail && privateKey);
}

export function getAdminServices() {
  if (cachedServices) return cachedServices;

  const { projectId, clientEmail, privateKey } = readEnv();

  if (!projectId || !clientEmail || !privateKey) {
    const error = new Error('Firebase Admin 서버 설정이 아직 완료되지 않았습니다.');
    error.code = 'FIREBASE_ADMIN_NOT_CONFIGURED';
    error.status = 503;
    throw error;
  }

  const app = getApps().length
    ? getApps()[0]
    : initializeApp({
        credential: cert({ projectId, clientEmail, privateKey }),
        projectId,
      });

  cachedServices = {
    adminDb: getFirestore(app),
    adminAuth: getAuth(app),
    Timestamp,
  };

  return cachedServices;
}

export { Timestamp };
