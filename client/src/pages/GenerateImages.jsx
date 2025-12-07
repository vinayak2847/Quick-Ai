import { Image, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const GenerateImages = () => {
  const imageStyles = [
    "Realistic",
    "Ghibli style",
    "Anime style",
    "Cartoon style",
    "Fantasy style",
    "3D style",
    "Portrait style",
  ];

  const [selectedStyle, setSelectedStyle] = useState("Realistic");
  const [input, setInput] = useState("");
  const [publish, setPublish] = useState(false);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const prompt = `Generate an image of ${input} in ${selectedStyle} style`;

      const { data } = await axios.post(
        "/api/ai/generate-image",
        { prompt, publish },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (data.success) {
        setContent(data.content);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-6 text-slate-700">

      {/* LEFT PANEL */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-5 bg-white rounded-xl border border-gray-200 shadow-sm"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="text-[#00AD25]" size={24} />
          <h1 className="text-xl font-semibold">AI Image Generator</h1>
        </div>

        {/* Input */}
        <p className="mt-6 text-sm font-medium">Describe Your Image</p>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={4}
          className="w-full p-3 mt-2 text-sm rounded-md border border-gray-300 outline-none"
          placeholder="Describe what you want to see in the image..."
          required
        />

        {/* Styles */}
        <p className="mt-5 text-sm font-medium">Choose Style</p>
        <div className="mt-3 flex gap-2 flex-wrap">
          {imageStyles.map((style) => (
            <span
              key={style}
              onClick={() => setSelectedStyle(style)}
              className={`px-4 py-1 text-xs rounded-full border cursor-pointer duration-200 ${
                selectedStyle === style
                  ? "bg-[#00AD25] text-white border-[#00AD25]"
                  : "border-gray-300 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {style}
            </span>
          ))}
        </div>

        {/* TOGGLE SWITCH — left = OFF | right = ON */}
        <div className="my-6 flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={publish}
              onChange={(e) => setPublish(e.target.checked)}
              className="peer sr-only"
            />

            {/* Track */}
            <div className="w-11 h-6 rounded-full bg-gray-300 peer-checked:bg-[#00AD25] transition-all duration-300" />

            {/* Thumb */}
            <span
              className="
              absolute w-5 h-5 bg-white rounded-full top-[2px] left-[2px]
              transition-all duration-300 shadow 
              peer-checked:translate-x-5"
            />
          </label>

          <p className="text-sm font-medium">Make this image public</p>
        </div>

        {/* Button */}
        <button
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#00AD25] to-[#04FF50] text-white py-2 mt-4 text-sm rounded-lg shadow active:scale-95 transition"
        >
          {loading ? (
            <span className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"></span>
          ) : (
            <Image size={18} />
          )}
          Generate Image
        </button>
      </form>

      {/* RIGHT PANEL */}
      <div className="w-full max-w-lg p-5 bg-white rounded-xl border border-gray-200 shadow-sm min-h-[350px]">
        <div className="flex items-center gap-3">
          <Image className="text-[#00AD25]" size={22} />
          <h1 className="text-lg font-semibold">Generated Image</h1>
        </div>

        {!content ? (
          <div className="flex-1 flex justify-center items-center text-gray-400 text-sm mt-10">
            <p>No image yet — generate one to view it here.</p>
          </div>
        ) : (
          <img src={content} alt="Generated" className="mt-5 rounded-md shadow-md w-full" />
        )}
      </div>
    </div>
  );
};

export default GenerateImages;
