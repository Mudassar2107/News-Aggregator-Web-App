import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

function Comments({ url }) {
  const { user, isAuthenticated } = useAuth0();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  const handleComment = () => {
    if (comment.trim()) {
      const newComment = {
        text: comment,
        user: user?.name || 'Anonymous',
        avatar: user?.picture,
        timestamp: new Date().toISOString(),
      };
      setComments([newComment, ...comments]);
      setComment("");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
      <h2 className="text-2xl font-bold mb-6">Comments</h2>
      
      {isAuthenticated ? (
        <div className="mb-6">
          <div className="flex gap-4 mb-4">
            <img
              src={user?.picture}
              alt={user?.name}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleComment}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
            >
              Comment
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-600 mb-6">Please login to comment</p>
      )}

      <div className="space-y-6">
        {comments.map((comment, index) => (
          <div key={index} className="flex gap-4">
            <img
              src={comment.avatar}
              alt={comment.user}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold">{comment.user}</span>
                <span className="text-sm text-gray-500">
                  {new Date(comment.timestamp).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700">{comment.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Comments;