// =============================================================================
// firebase.js — Conexão com o Firebase + Firestore — Sistema Libertadores
// =============================================================================
// Exporta `db` (usado pelo adaptador storage.js) e um CRUD genérico por coleção.
// A apiKey de um app web NÃO é secreta — a proteção é feita pelas REGRAS do
// Firestore (veja o README e o exemplo no fim deste arquivo).
// =============================================================================

import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported as analyticsIsSupported } from "firebase/analytics";
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCl0VowidRy_E1F5Oof5sleKP2qVmx9B5c",
  authDomain: "acompanhamento-libertadores.firebaseapp.com",
  projectId: "acompanhamento-libertadores",
  storageBucket: "acompanhamento-libertadores.firebasestorage.app",
  messagingSenderId: "89268070985",
  appId: "1:89268070985:web:a34ea9dcae0f4363d4ed98",
  measurementId: "G-8X4XNFMXCM",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Analytics só em navegador compatível (evita erros em SSR/Node).
export let analytics = null;
if (typeof window !== "undefined") {
  analyticsIsSupported()
    .then((ok) => { if (ok) analytics = getAnalytics(app); })
    .catch(() => {});
}

// =============================================================================
// CRUD genérico por coleção (criar, listar, editar, excluir + tempo real).
// O app já funciona via storage.js; este CRUD fica disponível caso você queira
// usar documentos por registro (ex.: colportores) diretamente.
// =============================================================================
export function crud(nomeColecao) {
  const ref = collection(db, nomeColecao);
  return {
    async create(dados) {
      const r = await addDoc(ref, { ...dados, criadoEm: dados.criadoEm || new Date().toISOString() });
      return r.id;
    },
    async save(registro) {
      if (!registro || !registro.id) throw new Error("save() exige um registro com 'id'.");
      const { id, ...dados } = registro;
      await setDoc(doc(db, nomeColecao, id), dados, { merge: true });
      return id;
    },
    async list() {
      const snap = await getDocs(ref);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    },
    async get(id) {
      const snap = await getDoc(doc(db, nomeColecao, id));
      return snap.exists() ? { id: snap.id, ...snap.data() } : null;
    },
    async update(id, mudancas) {
      await updateDoc(doc(db, nomeColecao, id), mudancas);
    },
    async remove(id) {
      await deleteDoc(doc(db, nomeColecao, id));
    },
    subscribe(callback) {
      return onSnapshot(ref, (snap) => callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
    },
  };
}

export const colportores     = crud("colportores");
export const relatorios      = crud("relatorios");
export const lideres         = crud("lideres");
export const campanhas       = crud("campanhas");
export const candidatos      = crud("candidatos");
export const mensagens       = crud("mensagens");
export const indicacoes      = crud("indicacoes");
export const resgates        = crud("resgates");
export const retiradas       = crud("retiradas");
export const avisos          = crud("avisos");
export const semanas         = crud("semanas");
export const solicitacoes    = crud("solicitacoes");
export const relatoriosLider = crud("relatoriosLider");

// -----------------------------------------------------------------------------
// EXEMPLO DE REGRAS DO FIRESTORE (Console > Firestore > Regras):
//
// rules_version = '2';
// service cloud.firestore {
//   match /databases/{database}/documents {
//     match /{document=**} {
//       allow read, write: if true;   // MODO DE TESTE — restrinja em produção
//     }
//   }
// }
// -----------------------------------------------------------------------------
