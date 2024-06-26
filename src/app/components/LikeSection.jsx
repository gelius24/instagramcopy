"use client"

import { app } from "@/firebase";
import { collection, deleteDoc, doc, getFirestore, onSnapshot, setDoc } from "firebase/firestore";
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react";
import { HiOutlineHeart, HiHeart } from "react-icons/hi";

export default function LikeSection({postID}) {
  const { data: session } = useSession();
  const db = getFirestore(app);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState([]);

  useEffect(() => {
    onSnapshot(collection(db, 'posts', postID, 'likes'), snapshot => {
      setLikes(snapshot.docs)
    })
  }, [db])

  useEffect(() => {
    if (likes.findIndex(like => like.id === session?.user?.uid) !== -1) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [likes])

  async function likePost() {
    if (liked) {
      await deleteDoc(doc(db, 'posts', postID, 'likes', session?.user?.uid))
    } else {
      await setDoc(doc(db, 'posts', postID, 'likes', session?.user?.uid), {
        username: session?.user?.name
      })
    }
  }

  return (
    <div>
      {
        session && (
          <div className="flex border-t border-gray-100 px-4 pt-4">
            <div className="flex items-center gap-2">
              {
                liked ? <HiHeart className="text-red-500 cursor-pointer text-3xl hover:scale-125 transition-transform duration-200 ease-out" onClick={likePost}/>
                : <HiOutlineHeart onClick={likePost} className="cursor-pointer text-3xl hover:scale-125 transition-transform duration-200 ease-out"/>
              }
              {
                likes.length > 0 && (
                  <p className="text-gray-500">{likes.length === 1 ? '1 like' : `${likes.length} likes`}</p>
                )
              }
            </div>
          </div>
        )
      }
    </div>
  )
}