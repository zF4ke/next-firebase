import styles from '../../styles/Admin.module.css';
import AuthCheck from '../../components/AuthCheck'
import ImageUploader from '../../components/ImageUploader'

import { firestore, auth, serverTimestamp } from '../../lib/firebase'
import { useEffect, useState } from 'react'

import { useRouter } from 'next/router'
import Link from 'next/link'

import { useForm } from 'react-hook-form'
import ReactMarkdown from 'react-markdown'
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore';
import toast from 'react-hot-toast'

export default function AdminPostEdit() {
    return (
        <AuthCheck>
            <PostManager />
        </AuthCheck>
    );
}

function PostManager() {
    const [preview, setPreview] = useState(false)

    const router = useRouter()
    const { slug } = router.query

    const postRef = firestore.collection('users').doc(auth.currentUser.uid).collection('posts').doc(slug)
    const [post] = useDocumentDataOnce(postRef)

    return (
        <main className={styles.container}>
            {post && (
                <>
                    <section>
                        <h1>{post.title}</h1>
                        <p>ID: {post.slug}</p>

                        <PostForm
                            postRef={postRef}
                            defaultValues={post}
                            preview={preview}
                        />
                    </section>

                    <aside>
                        <h3>Tools</h3>
                        <button onClick={() => setPreview(!preview)}>{preview ? 'Edit' : 'Preview'}</button>
                        <Link href={`/${post.username}/${post.slug}`} passHref>
                            <button className="btn-blue">Live view</button>
                        </Link>
                    </aside>
                </>
            )}
        </main>
    )
}

function PostForm({ postRef, defaultValues, preview }) {
    const { register, handleSubmit, reset, watch, setError, formState } = useForm({ defaultValues, mode: 'onChange' })

    const { isValid, isDirty, errors } = formState

    const updatePost = async ({ content, published }) => {
        await postRef.update({
            content,
            published,
            updatedAt: serverTimestamp()
        })

        reset({ content, published })

        toast.success('Post updated successfully.')
    }

    return (
        <form onSubmit={handleSubmit(updatePost)}>
            {preview && (
                <div className="card">
                    <ReactMarkdown>{watch('content')}</ReactMarkdown>
                </div>
            )}

            <div className={preview ? styles.hidden : styles.controls}>

                <ImageUploader />

                <textarea name="content" {...register("content", {
                    maxLength: 20000,
                    minLength: 10,
                    required: true
                })}></textarea>

                {errors.content && <p className="text-danger">{errors.content.message}</p>}

                <fieldset>
                    <input className={styles.checkbox} name="published" type="checkbox" {...register("input")} />
                    <label>Published</label>
                </fieldset>

                <button type="submit" className="btn-green" disabled={!isValid || !isDirty}>
                    Save Changes
                </button>
            </div>
        </form>
    )
}