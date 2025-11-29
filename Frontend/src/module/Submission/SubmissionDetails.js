import React from "react";
import dayjs from "dayjs";
import "../styles/SubmissionTable.css";

const SubmissionDetails = ({ data }) => {
  if (!data) return null;

  const user = data.data || {};

  return (
    <div className="details-container">
      <h2 className="details-heading">Submission Details</h2>

      <div className="details-grid">
        <DetailItem label="Full Name" value={user.fullName} />
        <DetailItem label="Age" value={user.age} />
        <DetailItem label="Gender" value={user.gender} />
        <DetailItem label="Email" value={user.email} />
        <DetailItem label="Skills" value={user.skills?.join(", ")} />
        <DetailItem label="DOB" value={dayjs(user.dob).format("YYYY-MM-DD")} />
        <DetailItem label="Employee ID" value={user.matBook_id} />
        <DetailItem
          label="Newsletter Subscribed"
          value={user.newsletter ? "Yes" : "No"}
        />
        <DetailItem
          label="Created At"
          value={dayjs(data.createdAt).format("YYYY-MM-DD hh:mm A")}
        />
      </div>

      <div className="details-bio">
        <h3>Bio</h3>
        <p>{user.bio}</p>
      </div>
    </div>
  );
};

const DetailItem = ({ label, value }) => (
  <div className="detail-item">
    <span className="detail-label">{label}</span>
    <span className="detail-value">{value || "-"}</span>
  </div>
);

export default SubmissionDetails;
