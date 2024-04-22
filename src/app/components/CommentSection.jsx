"use client";

import { app } from "@/firebase";
import {
  addDoc,
  collection,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Moment from 'react-moment'

export default function CommentSection({ postID }) {
  const { data: session } = useSession();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const db = getFirestore(app);

  async function handleSubmit(e) {
    e.preventDefault();
    const comm = comment;
    setComment("");
    await addDoc(collection(db, "posts", postID, "comments"), {
      comment: comm,
      username: session?.user?.name,
      userImage: session?.user?.image,
      timestamp: serverTimestamp(),
    });
  }

  useEffect(() => {
    onSnapshot(
      query(
        collection(db, "posts", postID, "comments"),
        orderBy("timestamp", "desc")
      ),
      (snapshot) => {
        setComments(snapshot.docs);
      }
    );
  }, [db]);

  return (
    <div>
      {comments.length > 0 && (
        <div className="mx-10 max-h-24 overflow-y-scroll">
          {comments.map((comment, id) => (
            <div key={id} className="flex items-center space-x-2 mb-2 justify-between">
              <img
                src={comment.data().userImage}
                alt=""
                className="h-7 w-7 rounded-full object-cover border p-[2px]"
              />
              <p className="text-sm flex-1 truncate">
                <span className="font-bold text-gray-700">{comment.data().username}</span>{" "}
                {comment.data().comment}
              </p>
              <Moment fromNow className="text-xs text-gray-400 pr-2">{comment.data().timestamp?.toDate()}</Moment>
            </div>
          ))}
        </div>
      )}

      {session && (
        <form onSubmit={handleSubmit} className="flex items-center p-4 gap-2">
          <img
            src={session.user.image}
            alt=""
            className="h-10 w-10 rounded-full border p-[4px] object-cover"
          />
          <input
            type="text"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
            placeholder="Add a comment..."
            className="bg-gray-50 ml-1 p-2 outline-none flex-1 focus:ring-0"
          />
          <button
            type="submit"
            disabled={!comment.trim()}
            className="text-blue-400 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            Post
          </button>
        </form>
      )}
    </div>
  );
}
