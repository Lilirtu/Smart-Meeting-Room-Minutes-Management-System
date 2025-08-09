import React from "react";
import { Link } from "react-router-dom";  // Import Link to handle navigation
import { FaDoorOpen } from 'react-icons/fa'; // Import an icon if needed

// Create the button component
const PostMeetingReviewButton = () => {
  return (
    <Link to="/post-meeting-review">
      <button className="custom-button">
        <FaDoorOpen style={{ marginRight: '8px' }} />
        Post Meeting Review
      </button>
    </Link>
  );
};

export default PostMeetingReviewButton;
