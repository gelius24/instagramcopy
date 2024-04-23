"use client"

import { useEffect, useState } from "react";
import { app } from "@/firebase";
import { collection, getFirestore, onSnapshot, orderBy, query } from "firebase/firestore";
import Post from "./Post";

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const db = getFirestore(app);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(data);
    });
    return () => unsubscribe();
  }, [db]);

  return (
    <div>
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
}


