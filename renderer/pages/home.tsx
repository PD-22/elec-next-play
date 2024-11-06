import React from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default function HomePage() {
  const handleFetch = async () => {
    const date = new Date().toISOString();
    const output = await window.ipc.invoke('write-date', date);
    console.log(`write "${date}" to "${output}"`);
  };

  return (
    <React.Fragment>
      <Head>
        <title>Home - Nextron (with-tailwindcss)</title>
      </Head>
      <div className='flex justify-center items-center min-h-screen p-8'>
        <button
          className="border p-2"
          onClick={handleFetch}
          autoFocus
        >
          Write Date to Desktop
        </button>
      </div >
      <div className="mt-1 w-full flex-wrap flex justify-center">
        <Link href="/next">Go to next page</Link>
      </div>
    </React.Fragment>
  )
}
