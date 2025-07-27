import { useEffect, useState } from 'react';
import axios from '../axios';
import { FaStar } from 'react-icons/fa';

function Profile() {
  const [userInfo, setUserInfo] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editText, setEditText] = useState('');
  const [editRating, setEditRating] = useState(1);

  const token = localStorage.getItem('token');
  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setMessage('Please log in to view profile.');
        return;
      }

      try {
        const [profileRes, reviewsRes] = await Promise.all([
          axios.get('/user/profile', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('/user/reviews', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setUserInfo(profileRes.data);
        setReviews(reviewsRes.data);
        setLoading(false);
      } catch (err) {
        setMessage('Failed to load profile or reviews.');
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleDelete = async (reviewId) => {
    try {
      await axios.delete(`/user/review/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReviews(reviews.filter((r) => r._id !== reviewId));
    } catch (err) {
      alert('Failed to delete review.');
    }
  };

  const handleEdit = (review) => {
    setEditingReviewId(review._id);
    setEditText(review.reviewText);
    setEditRating(review.starRating);
  };

  const handleSaveEdit = async () => {
    try {
      const res = await axios.put(
        `/user/review/${editingReviewId}`,
        { reviewText: editText, starRating: editRating },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedReview = res.data.review;

      setReviews(
        reviews.map((r) => (r._id === editingReviewId ? updatedReview : r))
      );
      setEditingReviewId(null);
      setEditText('');
      setEditRating(1);
    } catch (err) {
      alert('Failed to update review.');
    }
  };


  if (message) {
    return <p className="text-center text-red-500 mt-10">{message}</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      {loading ? (
        <div className="flex justify-center mt-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
            <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">👤 My Profile</h1>
            <div className="mb-4">
              <p><span className="font-semibold">Email:</span> {userInfo.email}</p>
              <p><span className="font-semibold">Username:</span> {userInfo.username}</p>
            </div>
            <div className="flex justify-between mt-6 text-gray-700">
              <div className="bg-blue-100 p-4 rounded text-center w-1/2 mr-2">
                <p className="text-lg font-bold">{userInfo.favorites?.length || 0}</p>
                <p className="text-sm">Favorites</p>
              </div>
              <div className="bg-green-100 p-4 rounded text-center w-1/2 ml-2">
                <p className="text-lg font-bold">{userInfo.watchlist?.length || 0}</p>
                <p className="text-sm">Watchlist</p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">📝 My Reviews</h2>
            {reviews.length === 0 ? (
              <p className="text-gray-500">You haven't written any reviews yet.</p>
            ) : (
              reviews.map((review) => (
                <div
                  key={review._id}
                  className="border-b border-gray-200 py-4 mb-4"
                >
                  <h3 className="text-lg font-semibold text-gray-700">
                    {review.movieTitle}
                  </h3>

                  {editingReviewId === review._id ? (
                    <>
                      <textarea
                        className="w-full border border-gray-300 rounded px-2 py-1 mt-2"
                        rows="3"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                      ></textarea>
                      <div className="mt-2 flex items-center space-x-2">
                        <label className="text-sm">Rating:</label>
                        <input
                          type="number"
                          min="1"
                          max="5"
                          className="w-16 border px-1 rounded"
                          value={editRating}
                          onChange={(e) => setEditRating(Number(e.target.value))}
                        />
                      </div>
                      <div className="flex gap-3 mt-2">
                        <button
                          className="bg-green-500 text-white px-3 py-1 rounded"
                          onClick={handleSaveEdit}
                        >
                          Save
                        </button>
                        <button
                          className="bg-gray-300 px-3 py-1 rounded"
                          onClick={() => setEditingReviewId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-gray-600 mt-2">{review.reviewText}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(review.starRating)].map((_, i) => (
                          <FaStar key={i} className="text-yellow-400" />
                        ))}
                      </div>
                      <div className="mt-2 space-x-3">
                        <button
                          className="text-blue-600 text-sm"
                          onClick={() => handleEdit(review)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-600 text-sm"
                          onClick={() => handleDelete(review._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
