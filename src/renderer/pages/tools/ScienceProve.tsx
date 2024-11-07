'use client';

import { useState } from 'react';
import { marked } from 'marked';

interface ApiResponse {
  result?: string;
  error?: string;
  [key: string]: any;
}

// TEMP
const INIT_QUESTION = 'Earth is flat';

export default function ScienceProve() {
  const [question, setQuestion] = useState<string>(INIT_QUESTION);
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleCheck = async () => {
    setLoading(true);
    setResult(null);

    const requestBody = {
      Question: question,
      Instruction:
        'Check the scientific evidence and research studies with statistically significant results that support or refute the claim provided. Please give just conclusion whether the results were clinically significant and links to the most relevant studies.',
    };

    try {
      const data = await window.electron.ipcRenderer.invoke(
        'perplexity',
        requestBody,
      );
      console.log('data', data);
      setResult(data);
    } catch (error: any) {
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1>Science Prove Tool</h1>
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Enter your fact"
        // Add a visible grey border to the input field
        style={{
          width: '100%',
          padding: '10px',
          marginBottom: '20px',
          border: '1px solid #ccc', // Grey border
          borderRadius: '4px', // Optional for rounded corners
        }}
      />
      <button
        type="button"
        onClick={handleCheck}
        style={{ padding: '10px 20px' }}
      >
        {loading ? 'Checking...' : 'Check'}
      </button>
      <div style={{ marginTop: '20px' }}>
        {result && result.error && (
          <p style={{ color: 'red' }}>{result.error}</p>
        )}
        {result && result.result && (
          <div
            /* eslint-disable-next-line react/no-danger */
            dangerouslySetInnerHTML={{ __html: marked(result.result) }}
          />
        )}
      </div>
    </div>
  );
}
