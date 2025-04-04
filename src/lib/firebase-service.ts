import { db } from "@/config/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  Timestamp,
  updateDoc,
  doc,
} from "firebase/firestore";
import admin from "firebase-admin";

try {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });
  }
} catch (error) {
  console.error("Firebase admin initialization error:", error);
}

const adminDb = admin.firestore();

export interface Subscriber {
  id?: string;
  email: string;
  subscriptionDate: Date | null;
  isActive: boolean;
  currentDay?: number;
  lastEmailSent?: Date | null;
  nextEmailDate?: Date;
  completedSequence?: boolean;
}

const SUBSCRIBERS_COLLECTION = "subscribers";

export const addSubscriber = async (email: string): Promise<string> => {
  try {
    const existingSubscriber = await getSubscriberByEmail(email);

    if (existingSubscriber) {
      throw new Error("Email already subscribed");
    }

    const subscriberData = {
      email,
      subscriptionDate: serverTimestamp(),
      isActive: true,
      currentDay: 0,
    };

    const docRef = await addDoc(
      collection(db, SUBSCRIBERS_COLLECTION),
      subscriberData
    );
    console.log("New subscriber added with ID: ", docRef.id);

    return docRef.id;
  } catch (error) {
    console.error("Error adding subscriber:", error);
    throw error;
  }
};

export const getSubscriberByEmail = async (
  email: string
): Promise<Subscriber | null> => {
  try {
    const q = query(
      collection(db, SUBSCRIBERS_COLLECTION),
      where("email", "==", email)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const doc = querySnapshot.docs[0];
    const data = doc.data();

    return {
      email: data.email,
      subscriptionDate: data.subscriptionDate
        ? data.subscriptionDate.toDate()
        : null,
      isActive: data.isActive,
      currentDay: data.currentDay,
      lastEmailSent: data.lastEmailSent ? data.lastEmailSent.toDate() : null,
    };
  } catch (error) {
    console.error("Error getting subscriber:", error);
    throw error;
  }
};

export const getActiveSubscribers = async (): Promise<Subscriber[]> => {
  try {
    const q = query(
      collection(db, SUBSCRIBERS_COLLECTION),
      where("isActive", "==", true)
    );

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((document) => {
      const data = document.data();
      return {
        email: data.email,
        subscriptionDate: data.subscriptionDate
          ? data.subscriptionDate.toDate()
          : null,
        isActive: data.isActive,
        currentDay: data.currentDay,
        lastEmailSent: data.lastEmailSent ? data.lastEmailSent.toDate() : null,
      };
    });
  } catch (error) {
    console.error("Error getting active subscribers:", error);
    throw new Error("Failed to get active subscribers");
  }
};

export const updateSubscriberProgress = async (
  subscriberId: string,
  currentDay: number
): Promise<void> => {
  try {
    const subscriberRef = doc(db, SUBSCRIBERS_COLLECTION, subscriberId);

    await updateDoc(subscriberRef, {
      currentDay,
      lastEmailSent: Timestamp.fromDate(new Date()),
    });

    console.log(`Updated subscriber ${subscriberId} to day ${currentDay}`);
  } catch (error) {
    console.error("Error updating subscriber:", error);
    throw new Error("Failed to update subscriber");
  }
};

export async function getActiveSubscribersDueForEmail(): Promise<Subscriber[]> {
  const now = new Date();
  
  try {
    const snapshot = await adminDb
      .collection("subscribers")
      .where("isActive", "==", true)
      .where("completedSequence", "==", false)
      .where("nextEmailDate", "<=", now)
      .get();
    
    if (snapshot.empty) {
      return [];
    }
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        email: data.email,
        subscriptionDate: data.subscriptionDate?.toDate() || new Date(),
        isActive: data.isActive,
        currentDay: data.currentDay,
        nextEmailDate: data.nextEmailDate?.toDate() || new Date(),
        completedSequence: data.completedSequence,
      };
    });
  } catch (error) {
    console.error("Error getting subscribers due for email:", error);
    return [];
  }
}

export async function updateSubscriberAfterEmailSent(
  subscriberId: string, 
  currentDay: number
): Promise<boolean> {
  try {
    const nextDay = currentDay + 1;
    const now = new Date();
    const nextEmailDate = new Date(now);
    nextEmailDate.setDate(now.getDate() + 1); // Schedule next email for tomorrow
    
    // If we've reached the end of the 30-day sequence
    if (nextDay > 30) {
      await adminDb.collection("subscribers").doc(subscriberId).update({
        currentDay: nextDay - 1,
        completedSequence: true
      });
    } else {
      await adminDb.collection("subscribers").doc(subscriberId).update({
        currentDay: nextDay,
        nextEmailDate: nextEmailDate
      });
    }
    
    return true;
  } catch (error) {
    console.error(`Error updating subscriber ${subscriberId}:`, error);
    return false;
  }
}
