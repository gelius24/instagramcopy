import { app } from "@/firebase"
import { collection, getDocs, getFirestore, orderBy, query } from "firebase/firestore"
import Post from "./Post";

export default async function Posts() {
  const db = getFirestore(app);
  const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
  const querySnapshot = await getDocs(q);

  // let data = [];
  // querySnapshot.forEach(doc => {
  //   data.push({id: doc.id, ...doc.data() });
  // })

  const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  return (
    <div>
      {data.map(post => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  )
}