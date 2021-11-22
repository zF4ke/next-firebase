import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import 'firebase/compat/storage'


const firebaseConfig = {
  apiKey: "AIzaSyCo8yOERHjFo06A4ssDx4iBu6IZdkUppMU",
  authDomain: "nextfire-8fb96.firebaseapp.com",
  projectId: "nextfire-8fb96",
  storageBucket: "nextfire-8fb96.appspot.com",
  messagingSenderId: "1023717407911",
  appId: "1:1023717407911:web:9deec90a51c8af89e7ef82"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth()
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider()
export const firestore = firebase.firestore()
export const storage = firebase.storage()
export const fromMillis = firebase.firestore.Timestamp.fromMillis;

/// Helper functions

/**
 * Gets a users/{uid} document with username
 * @param  {string} username
*/
export async function getUserWithUsername(username) {
  const usersRef = firestore.collection('users')
  const query = usersRef.where('username', '==', username).limit(1)
  const userDoc = (await query.get()).docs[0]

  return userDoc
}

/**
 * Converts a firestore document to JSON
 * @param  {DocumentSnapshot} doc
*/

// DOESNT WORK BC IT RETURNS A PROMISE (??)

/* export async function postToJSON(doc) {
  const data = doc.data()

  return {
    ...data,
    // Gotcha! firestore timestamp NOT serializable to JSON. Must convert to milliseconds
    createdAt: data?.createdAt.toMillis() || 0,
    updatedAt: data?.updatedAt.toMillis() || 0,
  }
} */

