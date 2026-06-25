// =============================================================================
// storage.js — Adaptador que reimplementa `window.storage` usando o Firestore.
// =============================================================================
// O app (sistema.jsx) persiste tudo através de window.storage.get/set, gravando
// cada chave "colportagem:*" como um JSON string. Este adaptador faz essas
// chamadas lerem/gravarem no Firestore, então TODO o app passa a usar o Firebase
// sem precisar reescrever nada.
//
// Cada chave vira um documento na coleção "appState":
//   appState/colportagem:colportores  -> { key, value: "<json>", updatedAt }
//
// Todos os dados são compartilhados (o app usa shared=true), ou seja, diretor,
// líderes e colportores enxergam a mesma base.
// =============================================================================

import { db } from "./firebase";
import { doc, getDoc, setDoc, deleteDoc, collection, getDocs } from "firebase/firestore";

const COLECAO = "appState";

// IDs de documento no Firestore não podem conter "/". As chaves do app usam ":"
// (permitido), então só trocamos a barra por segurança.
const idSeguro = (key) => String(key).replace(/\//g, "__");

const storage = {
  // get(key) -> { key, value, shared } | null   (value é um JSON string)
  async get(key /*, shared */) {
    try {
      const snap = await getDoc(doc(db, COLECAO, idSeguro(key)));
      if (!snap.exists()) return null;
      return { key, value: snap.data().value, shared: true };
    } catch (e) {
      console.error("storage.get falhou:", key, e);
      return null;
    }
  },

  // set(key, value) -> grava o JSON string recebido
  async set(key, value /*, shared */) {
    await setDoc(doc(db, COLECAO, idSeguro(key)), {
      key,
      value,
      updatedAt: Date.now(),
    });
    return { key, value, shared: true };
  },

  // delete(key)
  async delete(key /*, shared */) {
    await deleteDoc(doc(db, COLECAO, idSeguro(key)));
    return { key, deleted: true, shared: true };
  },

  // list(prefix) -> { keys, prefix, shared }
  async list(prefix = "" /*, shared */) {
    const snap = await getDocs(collection(db, COLECAO));
    const keys = snap.docs
      .map((d) => d.data().key)
      .filter((k) => typeof k === "string" && k.startsWith(prefix));
    return { keys, prefix, shared: true };
  },
};

// Disponibiliza globalmente para o app (que chama window.storage.*).
if (typeof window !== "undefined") {
  window.storage = storage;
}

export default storage;
