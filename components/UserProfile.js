/* eslint-disable @next/next/no-img-element */
export default function UserProfile({ user }) {

    return (
        <div className="box-center">
            <img src={user?.photoURL} alt={user?.username} className="card-img-center" />
            <p>
                <i>@{user?.username}</i>
            </p>
            <h1>{user?.displayName}</h1>
        </div>
    );
}