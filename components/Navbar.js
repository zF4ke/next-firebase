/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import { useContext } from 'react'
import { UserContext } from '../lib/context'
// import Image from 'next/image'

export default function Navbar() {
    const { user, username } = useContext(UserContext)

    return (
        <nav className="navbar">
            <ul>
                <li>
                    <Link href="/" passHref>
                        <button className="btn-logo">NXT</button>
                    </Link>
                </li>

                {/* User is signed-in and has an username */}
                {username && (
                    <>
                        <li className="push-left">
                            <Link href='/admin' passHref>
                                <button className="btn-blue">Write Posts</button>
                            </Link>
                        </li>
                        <li>
                            <Link href={`/${username}`} passHref>
                                <img src={user?.photoURL} alt={username} />
                            </Link>
                        </li>
                    </>
                )}

                {/* User is not signed or has not created an username */}
                {!username && (
                    <>
                        <li>
                            <Link href='/enter' passHref>
                                <button className="btn-blue">Log in</button>
                            </Link>
                        </li>
                    </>
                )}
            </ul>
        </nav >
    );
}