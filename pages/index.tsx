export default function Home() {
  const handleFetch = async () => {
    const date = new Date().toISOString();
    console.log('date:', date);

    const output = await window.electronAPI.invoke('write-date', date);
    console.log('output:', output);
    alert(`File written to: "${output}"`);
  };

  return (
    <div className='flex justify-center items-center min-h-screen p-8'>
      <button
        className="border p-2"
        onClick={handleFetch}
        autoFocus
      >
        Write Date to Desktop
      </button>
    </div >
  );
}
