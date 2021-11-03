import { auth, firestore } from './firebase'

import { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'

export function useUserData() {
    const [user] = useAuthState(auth)
    const [username, setUsername] = useState(null)

    useEffect(() => {

        //turn of realtime subscription when is not longer needed
        let unsubscribe;

        if (user) {
            const ref = firestore.collection('users').doc(user.uid)
            unsubscribe = ref.onSnapshot(doc => {
                setUsername(doc.data()?.username)
            })
        } else {
            setUsername(null)
        }

        return unsubscribe

    }, [user])

    return { user, username }
}