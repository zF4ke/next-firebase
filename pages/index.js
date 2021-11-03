import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
// import styles from '../styles/Home.module.css'
import Loader from '../components/Loader'
import toast from 'react-hot-toast'

export default function Home() {
  return (
    <main>
      {/* <Loader show /> */}
      <button onClick={() => toast.success('Hi toast!')}>
        Toast Me
      </button>
    </main>
  )
}
