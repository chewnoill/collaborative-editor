import db from "./db";
import { Prisma, document } from "@prisma/client";

export const insertUpdate = async (
  documentId: string,
  documentUpdate: Uint8Array
): Promise<any> => {
  return await db.document_updates_queue.create({
    data: {
      document_id: documentId,
      document_update: Buffer.from(documentUpdate),
    },
  });
};

export const createDocument = async (
  initState: Uint8Array,
  initValue: string,
  initWeb_rtc_key: string
): Promise<Prisma.Prisma__documentClient<document>> => {
  return await db.document.create({
    data: {
      value: initValue,
      origin: Buffer.from(initState),
      web_rtc_key: initWeb_rtc_key,
      latest_update_time: new Date(Date.now()),
    },
  });
};

export const loadDocument = async (documentId: string): Promise<any> => {
  // TODO:
  // find document by id in docs table
  const doc = await db.document.findFirst({
    where: {
      id: documentId,
    },
  });
  const updates = await db.document_updates_queue.findMany({
    where: {
      created_at: { gt: doc.latest_update_time },
    },
  });
  return { ...doc, document_updates_queue: updates };
};

export const documentExists = async (documentId: string): Promise<boolean> => {
  return !!(
    await db.document.findFirst({
      where: {
        id: documentId,
      },
    })
  ).id;
};
