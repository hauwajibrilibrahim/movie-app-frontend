import { useState } from 'react';
import axios from '../axios';

const ReviewCard = ({ review, token, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(review.reviewText);
  const [editedRating, setEditedRating] = useState(review.starRating);

  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        `/user/review/${review._id}`,
        { reviewText: editedText, starRating: editedRating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onUpdate(res.data); 
      setIsEditing(false);
    } catch (err) {
      console.error('Update error:', err.message);
      alert('Failed to update review');
    }
  };

  return (
    <div className="p-4 border rounded-md shadow-md bg-white mb-4">
      <h3 className="text-lg font-bold mb-1">{review.movieTitle}</h3>

      {isEditing ? (
        <>
          <textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />
          <input
            type="number"
            min="1"
            max="5"
            value={editedRating}
            onChange={(e) => setEditedRating(Number(e.target.value))}
            className="w-20 border p-1 rounded mb-2"
          />
          <div className="space-x-2">
            <button onClick={handleUpdate} className="px-3 py-1 bg-green-600 text-white rounded">Save</button>
            <button onClick={() => setIsEditing(false)} className="px-3 py-1 bg-gray-400 text-white rounded">Cancel</button>
          </div>
        </>
      ) : (
        <>
          <p className="text-gray-700 mb-1">{review.reviewText}</p>
          <p className="text-yellow-500 mb-2">⭐ {review.starRating}/5</p>
          <div className="space-x-2">
            <button onClick={() => setIsEditing(true)} className="px-3 py-1 bg-blue-600 text-white rounded">Edit</button>
            <button onClick={() => onDelete(review._id)} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
          </div>
        </>
      )}
    </div>
  );
};

export default ReviewCard;
