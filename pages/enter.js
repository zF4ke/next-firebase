import { auth, googleAuthProvider, firestore } from '../lib/firebase'
import { useContext, useState, useEffect, useCallback } from 'react'
import { UserContext } from '../lib/context'

import debounce from 'lodash.debounce'

export default function Enter(props) {

    const { user, username } = useContext(UserContext)

    return (
        <main>
            {user ? !username ? <UsernameForm /> : <SignOutButton /> : <SignInButton />

            }
        </main>
    );
}

function SignInButton() {
    const signInWithGoogle = async () => {
        await auth.signInWithPopup(googleAuthProvider)
    }

    return (
        <button className="btn-google" onClick={signInWithGoogle}>
            Sign In With Google
        </button>
    )
}

function SignOutButton() {
    return <button onClick={() => auth.signOut()}>Sign Out</button>
}

function UsernameForm() {
    const [formValue, setFormValue] = useState('')
    const [isValid, setIsValid] = useState(false)
    const [loading, setLoading] = useState(false)

    const { user, username } = useContext(UserContext)

    const onChange = (e) => {

        const val = e.target.value.toLowerCase()
        const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

        if (val.length < 3) {
            setFormValue(val)
            setLoading(false)
            setIsValid(false)
        }

        if (re.test(val)) {
            setFormValue(val)
            setLoading(true)
            setIsValid(false)
        }

    }

    const onSubmit = async e => {
        e.preventDefault()

        const userDoc = firestore.doc(`users/${user.uid}`)
        const usernameDoc = firestore.doc(`usernames/${formValue}`)

        try {
            const batch = firestore.batch()
            batch.set(userDoc, { username: formValue, photoURL: user.photoURL, displayName: user.displayName })
            batch.set(usernameDoc, { uid: user.uid })

            await batch.commit()
        } catch (err) {
            console.error(err)
        }


    }

    useEffect(() => {
        checkUsername(formValue)
    }, [checkUsername, formValue])

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const checkUsername = useCallback(
        debounce(async (username) => {
            if (username.length >= 3) {
                const ref = firestore.doc(`usernames/${username}`)
                const { exists } = await ref.get()

                setIsValid(!exists)
                setLoading(false)
            }
        }, 500),
        []
    )

    return (
        !username && (
            <section>
                <h3>Choose Username</h3>
                <form onSubmit={onSubmit}>
                    <input name="username" placeholder="username" value={formValue} onChange={onChange} />

                    <UsernameMessage username={formValue} isValid={isValid} loading={loading} />

                    <button type="submit" className="btn-green" disabled={!isValid}>
                        Choose
                    </button>

                    <h3>Debug State</h3>
                    <div>
                        Username: {formValue}
                        <br />
                        Loading: {loading.toString()}
                        <br />
                        Username Valid: {isValid.toString()}
                    </div>
                </form>
            </section>
        )
    )
}

function UsernameMessage({ username, isValid, loading }) {

    if (loading) {
        return <p>Checking...</p>
    } else if (isValid) {
        return <p className="text-success">{username} is available</p>
    } else if (username && !isValid) {
        return <p className="text-danger">That username is taken</p>
    } else {
        return <p></p>
    }
}