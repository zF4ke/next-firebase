import UserProfile from '../../components/UserProfile'
import PostFeed from '../../components/PostFeed'
import { getUserWithUsername, postToJSON } from '../../lib/firebase'

export async function getServerSideProps({ query }) {

    const { username } = query

    const userDoc = await getUserWithUsername(username)

    let user = null;
    let postsDocs = null;
    let posts = []

    if (userDoc) {
        const postsQuery = userDoc.ref
            .collection('posts')
            .where('published', '==', true)
            .orderBy('createdAt', 'desc')
            .limit(5)

        postsDocs = (await postsQuery.get()).docs/* .map(postToJSON) */

        postsDocs.forEach(doc => {
            let data = doc.data()

            posts.push({
                ...data,
                // Gotcha! firestore timestamp NOT serializable to JSON. Must convert to milliseconds
                createdAt: data?.createdAt.toMillis() || 0,
                updatedAt: data?.updatedAt.toMillis() || 0,
            })
        })
    }

    return {
        props: { user, posts }
    }
}

export default function UserProfilePage({ user, posts }) {

    return (
        <main>
            <UserProfile user={user} />
            <PostFeed posts={posts} />
        </main>
    );
}