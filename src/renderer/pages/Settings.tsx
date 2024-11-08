/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable promise/always-return */
/* eslint-disable  */

'use client';

import { useEffect, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { ApiKey } from '../../main/utils/settingsManager';

const loadApiKey = async (serviceName: ApiKey) => {
  const result = await window.electron.ipcRenderer.invoke(
    'load-api-key',
    serviceName,
  );
  if (typeof result !== 'string')
    throw new Error(`Invalid result of "load-api-key"`, result);
  return result;
};

const saveApiKey = async (serviceName: ApiKey, key: string) => {
  const result = await window.electron.ipcRenderer.invoke(
    'save-api-key',
    serviceName,
    key,
  );
  if (result !== true)
    throw new Error(`Invalid result of "save-api-key"`, result);
};

export default function Settings() {
  const [openAiKey, setOpenAiKey] = useState<string>('');
  const [perplexityKey, setPerplexityKey] = useState<string>('');
  // TEMP: temp show openai api key
  const [showOpenAiKey, setShowOpenAiKey] = useState<boolean>(true);
  // TEMP: temp show perplexity api key
  const [showPerplexityKey, setShowPerplexityKey] = useState<boolean>(true);
  const [showNotification, setShowNotification] = useState<boolean>(false);

  // Load the API keys when the page loads
  useEffect(() => {
    loadApiKey('OPENAI').then((x) => {
      setOpenAiKey(x || '');
    });
    loadApiKey('PERPLEXITY').then((x) => {
      setPerplexityKey(x || '');
    });
  }, []);

  const handleSave = async () => {
    // Use the settingsManager to save the API keys
    await Promise.all([
      saveApiKey('OPENAI', openAiKey),
      saveApiKey('PERPLEXITY', perplexityKey),
    ]);

    // Show notification
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const toggleShowOpenAiKey = () => {
    setShowOpenAiKey(!showOpenAiKey);
  };

  const toggleShowPerplexityKey = () => {
    setShowPerplexityKey(!showPerplexityKey);
  };

  return (
    <div className="p-8">
      <h1>API Keys</h1>
      <p>
        By default, your API Keys are stored locally on your browser and never
        sent anywhere else.
      </p>

      {/* OpenAI API Key Section */}
      <div className="flex items-center gap-4 mb-4">
        <label htmlFor="openai-key" className="text-lg font-semibold">
          OpenAI API Key:
        </label>
        <div className="relative w-full">
          <input
            id="openai-key"
            type={showOpenAiKey ? 'text' : 'password'}
            value={openAiKey}
            onChange={(e) => setOpenAiKey(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 w-full"
            placeholder="Enter your OpenAI API key"
          />
          <button
            type="button"
            onClick={toggleShowOpenAiKey}
            className="absolute right-2 top-2 text-gray-500"
          >
            {showOpenAiKey ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
      </div>

      {/* Perplexity API Key Section */}
      <div className="flex items-center gap-4 mb-4">
        <label htmlFor="perplexity-key" className="text-lg font-semibold">
          Perplexity API Key:
        </label>
        <div className="relative w-full">
          <input
            id="perplexity-key"
            type={showPerplexityKey ? 'text' : 'password'}
            value={perplexityKey}
            onChange={(e) => setPerplexityKey(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 w-full"
            placeholder="Enter your Perplexity API key"
          />
          <button
            type="button"
            onClick={toggleShowPerplexityKey}
            className="absolute right-2 top-2 text-gray-500"
          >
            {showPerplexityKey ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={handleSave}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Save Keys
      </button>

      {/* Custom Notification */}
      {showNotification && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg">
          API Keys saved successfully!
        </div>
      )}
    </div>
  );
}
