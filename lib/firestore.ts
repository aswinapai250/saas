import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  runTransaction,
  serverTimestamp
} from "firebase/firestore";
import { db } from "./firebase";

export interface UserProfile {
  uid: string;
  username: string;
  displayName: string;
  bio: string;
  photoURL: string;
  plan: "free" | "pro";
  createdAt: any;
  theme: string;
  links: LinkItem[];
}

export interface LinkItem {
  id: string;
  title: string;
  url: string;
  emoji?: string;
  order: number;
  enabled: boolean;
}

/**
 * Fetch a user profile by UID
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const userDoc = await getDoc(doc(db, "users", uid));
  if (userDoc.exists()) {
    return userDoc.data() as UserProfile;
  }
  return null;
}

/**
 * Check if a username is already taken
 */
export async function isUsernameAvailable(username: string): Promise<boolean> {
  const usernameDoc = await getDoc(doc(db, "usernames", username.toLowerCase()));
  return !usernameDoc.exists();
}

/**
 * Claim a username and create/update user profile in a transaction
 */
export async function claimUsername(uid: string, username: string, initialData: Partial<UserProfile>) {
  const usernameLower = username.toLowerCase();
  
  await runTransaction(db, async (transaction) => {
    const usernameRef = doc(db, "usernames", usernameLower);
    const userRef = doc(db, "users", uid);
    
    const usernameSnap = await transaction.get(usernameRef);
    if (usernameSnap.exists()) {
      throw new Error("Username already taken");
    }
    
    transaction.set(usernameRef, { uid });
    transaction.set(userRef, {
      ...initialData,
      username: usernameLower,
      uid,
      plan: "free",
      theme: "default-light",
      links: [],
      createdAt: serverTimestamp(),
    }, { merge: true });
  });
}

/**
 * Update user profile data
 */
export async function updateProfile(uid: string, data: Partial<UserProfile>) {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, data);
}

/**
 * Get user profile by username (for public bio page)
 */
export async function getUserByUsername(username: string): Promise<UserProfile | null> {
  if (!username) return null;
  const usernameDoc = await getDoc(doc(db, "usernames", username.toLowerCase()));
  if (!usernameDoc.exists()) return null;
  
  const uid = usernameDoc.data().uid;
  return getUserProfile(uid);
}

/**
 * Get all usernames (for sitemap generation)
 */
export async function getAllUsernames(): Promise<string[]> {
  const q = query(collection(db, "usernames"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.id);
}
