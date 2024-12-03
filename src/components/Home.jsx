import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import defaultImg from "../images/news-image.jpg";

const API_KEY = "test"; // Guardian API Key - 'test' key works for development
const BASE_URL = "https://content.guardianapis.com";
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

// Cache structure
const newsCache = {
  data: {},
  timestamp: {},
};

const Home = ({ menu, search }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const getCachedData = (cacheKey) => {
    const cachedData = newsCache.data[cacheKey];
    const cachedTimestamp = newsCache.timestamp[cacheKey];
    
    if (cachedData && cachedTimestamp) {
      const now = new Date().getTime();
      if (now - cachedTimestamp < CACHE_DURATION) {
        return cachedData;
      }
    }
    return null;
  };

  const setCachedData = (cacheKey, data) => {
    newsCache.data[cacheKey] = data;
    newsCache.timestamp[cacheKey] = new Date().getTime();
  };

  // Guardian API
  const getNews = async () => {
    setLoading(true);
    setError(null);

    try {
      const queryParam = menu === "general" || !menu ? "" : menu;
      const section = queryParam || "news";
      
      const cacheKey = `guardian-${section}`;
      const cachedData = getCachedData(cacheKey);

      if (cachedData) {
        setNews(cachedData);
        setLoading(false);
        return;
      }

      const url = `${BASE_URL}/search?section=${section}&show-fields=thumbnail,bodyText&api-key=${API_KEY}&page-size=12`;

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.response?.message || `Failed to fetch news (Status: ${response.status})`);
      }

      if (!data.response?.results || !Array.isArray(data.response.results)) {
        throw new Error('Invalid response format from API');
      }

      // Transform the data to match our existing structure
      const transformedArticles = data.response.results.map(article => ({
        title: article.webTitle,
        description: article.fields?.bodyText?.substring(0, 200) + "...",
        urlToImage: article.fields?.thumbnail || defaultImg,
        url: article.webUrl,
        publishedAt: article.webPublicationDate,
        source: {
          name: "The Guardian"
        }
      }));

      setCachedData(cacheKey, transformedArticles);
      setNews(transformedArticles);
      setLoading(false);
      setRetryCount(0);

    } catch (err) {
      console.error('Error fetching news:', err);
      setError(err.message || 'Failed to fetch news. Please try again.');
      
      // Try to use cached data as fallback
      const section = menu === "general" || !menu ? "news" : menu;
      const cacheKey = `guardian-${section}`;
      const staleCachedData = newsCache.data[cacheKey];
      
      if (staleCachedData) {
        setNews(staleCachedData);
        setError("Using cached data due to error. Please try again later.");
      } else {
        setNews([]);
      }
      
      setLoading(false);

      if (retryCount < 3 && !err.message.includes("rate limit")) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          getNews();
        }, 2000 * (retryCount + 1));
      }
    }
  };

  useEffect(() => {
    getNews();
  }, [menu]);

  const filteredNews = news?.filter((item) =>
    item?.title?.toLowerCase().includes(search?.toLowerCase() || '')
  ) || [];

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 pt-24 md:pt-28 pb-10 px-4 md:px-6">
        <div className="max-w-7xl mx-auto text-center py-20">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Notice</h2>
          <p className="text-gray-600">{error}</p>
          {retryCount >= 3 && !error.includes("rate limit") && (
            <button 
              onClick={() => {
                setRetryCount(0);
                getNews();
              }}
              className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-24 md:pt-28 pb-10 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {filteredNews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNews.map((item, index) => (
                  <Link
                    to="/details"
                    state={{ news: item }}
                    key={index}
                    className="bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={item.urlToImage || defaultImg}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                        onError={(e) => {
                          e.target.src = defaultImg;
                        }}
                      />
                    </div>
                    <div className="p-4">
                      <h2 className="text-lg font-semibold line-clamp-2 mb-2 text-gray-800">
                        {item.title}
                      </h2>
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {item.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">No news found</h2>
                <p className="text-gray-600">Try adjusting your search or category</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;