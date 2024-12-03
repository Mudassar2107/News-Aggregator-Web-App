import { useLocation, useNavigate } from "react-router-dom";
import Comments from "./Comments";
import defaultImg from "../images/news-image.jpg";
import { useState } from "react";

function NewsDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const news = location.state?.news;

  if (!news) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-24 md:pt-28 pb-10 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Article Section */}
          <div className="bg-white rounded-xl shadow-md p-6 md:p-8 animate-fade-in">
            <button 
              onClick={() => navigate(-1)}
              className="mb-6 text-gray-600 hover:text-gray-800 transition-colors duration-300 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to News
            </button>

            <h1 className="font-bold text-2xl md:text-3xl text-gray-900 mb-4 transition-all duration-300 hover:text-gray-700">
              {news.title}
            </h1>

            <div className="prose max-w-none">
              <p className="text-gray-600 text-lg mb-6">{news.description}</p>
              
              <div className="relative rounded-xl overflow-hidden mb-6 bg-gray-100">
                <div className={`absolute inset-0 bg-gray-200 animate-pulse ${imageLoaded ? 'hidden' : 'block'}`} />
                <img
                  src={news.urlToImage || defaultImg}
                  alt={news.title}
                  className={`w-full h-auto transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => setImageLoaded(true)}
                  onError={(e) => {
                    e.target.src = defaultImg;
                    setImageLoaded(true);
                  }}
                />
              </div>

              <div className="space-y-4">
                <p className="text-gray-700">{news.content}</p>
                
                <div className="border-l-4 border-blue-500 pl-4 space-y-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Author:</span> {news.author || 'Unknown'}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Published:</span> {new Date(news.publishedAt).toLocaleString()}
                  </p>
                </div>

                <a
                  href={news.url}
                  className="inline-block mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Read Full Article
                </a>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="animate-fade-in-up">
            <Comments url={news.url} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewsDetails;