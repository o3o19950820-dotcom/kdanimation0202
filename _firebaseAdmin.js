import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

let cachedServices = null;

function readEnv() {
  const rawJson = String(process.env.FIREBASE_SERVICE_ACCOUNT_JSON || '').trim();

  if (rawJson) {
    try {
      const serviceAccount = JSON.parse(rawJson);

      return {
        projectId: String(serviceAccount.project_id || serviceAccount.projectId || '').trim(),
        clientEmail: String(serviceAccount.client_email || serviceAccount.clientEmail || '').trim(),
        privateKey: String(serviceAccount.private_key || serviceAccount.privateKey || '').replace(/\\n/g, '\n').trim(),
      };
    } catch (error) {
      const err = new Error('FIREBASE_SERVICE_ACCOUNT_JSON 형식이 올바른 JSON이 아닙니다.');
      err.code = 'FIREBASE_SERVICE_ACCOUNT_JSON_INVALID';
      err.status = 503;
      throw err;
    }
  }

  return {
    projectId: String(process.env.FIREBASE_PROJECT_ID || '').trim(),
    clientEmail: String(process.env.FIREBASE_CLIENT_EMAIL || '').trim(),
    privateKey: String(process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n').trim(),
  };
}

export function isAdminConfigured() {
  try {
    const { projectId, clientEmail, privateKey } = readEnv();
    return Boolean(projectId && clientEmail && privateKey);
  } catch {
    return false;
  }
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
