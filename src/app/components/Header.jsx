"use client"

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Modal from 'react-modal'
import { IoMdAddCircleOutline } from "react-icons/io";
import { HiCamera } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";
import { app } from "@/firebase";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { getFirestore, addDoc, collection, serverTimestamp } from "firebase/firestore";

export default function Header() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const filePickerRef = useRef(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [caption, setCaption] = useState('');
  const [postUploading, setPostUploading] = useState(false);
  const db = getFirestore(app);

  function addImageToPost(e) {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImageFileUrl(URL.createObjectURL(file)); 
    }
  }

  async function uploadImageToStorage() {
    setImageFileUploading(true);
    const storage = getStorage(app)
    const filename = new Date().getTime() + '-' + selectedFile.name
    const storageRef = ref(storage, filename)
    const uploadTask = uploadBytesResumable(storageRef, selectedFile);
    uploadTask.on('state_changed', snap => {
      const progress = (snap.bytesTransferred / snap.totalBytes) * 100;
      console.log(progress)
    },
    error => {
      console.error(error)
      setImageFileUploading(false);
      setImageFileUrl(null);
      setSelectedFile(null);
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
        setImageFileUrl(downloadURL);
        setImageFileUploading(false);
      })
    }
    )
  }

  useEffect(() => {
    if (selectedFile) {
      uploadImageToStorage();
  }
}, [selectedFile]);

async function handleSubmit() {
  setPostUploading(true);
  const docRef = await addDoc(collection(db, 'posts'), {
    username: session.user.name,
    caption,
    profileImg: session.user.image,
    image: imageFileUrl,
    timestamp: serverTimestamp()
  })
  setPostUploading(false);
  setIsOpen(false);
  location.reload();
}

  return (
    <div className="shadow-sm border-b sticky top-o bg-white z-30 p-3">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        {/* logo */}
        <Link href='/' className="hidden lg:inline-flex">
          <p className="">𝓘𝓷𝓼𝓽𝓪𝓬𝓵𝓸𝓷𝓮</p> 
        </Link>
        <Link href='/' className="lg:hidden">
        <Image src='/logo.png' width={40} height={40} alt='logo'></Image>
        </Link>
        {/* sarch input */}
        <input type="text" placeholder="Search" className="bg=gray-50 border border-gray-200 rounded text-sm w-full py-2 px-4 max-w-[210px]" />
        {/* menu items */}
        {
          session ? <div className="flex gap-2 items-center">
          <IoMdAddCircleOutline onClick={() => setIsOpen(true)} className="text-2xl cursor-pointer hover:scale-125 transition duration-300 hover:text-red-600"/>
            <img onClick={signOut} src={session.user.image} width={40} height={40} className="rounded-full cursor-pointer" alt={session.user.name}/>
          </div>: <button onClick={() => signIn()} className="text-sm font-semibold text-blue-500">Log In</button>
        }
        {
          isOpen && (<Modal isOpen={isOpen} className='max-w-lg w-[90%] p-6 absolute top-56 left-[50%] translate-x-[-50%] bg-white border-2 rounded-md shadow-md' onRequestClose={() => setIsOpen(false)} ariaHideApp={false}>
            <div className="flex flex-col justify-center items-center h-[100%]">
              {
                selectedFile ? <img src={imageFileUrl} onClick={() => {filePickerRef.current.click(); setSelectedFile(null)}} alt="slected file" className={`object-cover w-full max-h-[250px] cursor-pointer ${imageFileUploading ? 'animate-pulse' : ''}`}/> : <HiCamera className="text-5xl text-gray-400 cursor-pointer" onClick={() => filePickerRef.current.click()} />
              }
              
              <input type="file" accept="image/*" onChange={addImageToPost} hidden ref={filePickerRef} />
              <input type="text" maxLength='150' placeholder="Write your caption" onChange={e => setCaption(e.target.value)} className="m-4 border-none text-center w-full focus:ring-0 outline-none" />
              <button className="w-full bg-red-600 text-white p-2 shadow-md rounded-lg hover:brightness-105 disabled:bg-gray-200 disabled:cursor-not-allowed disabled:hover:brightness-100" onClick={handleSubmit} disabled={postUploading || !caption.trim() || imageFileUploading || !selectedFile}>Upload post</button>
              <AiOutlineClose onClick={() => {setIsOpen(false); setSelectedFile(null)}} className="absolute top-2 right-2 cursor-pointer hover:text-red-600 transition duration-300"/>
            </div>
          </Modal>)
        }
      </div>
    </div>
  )
}