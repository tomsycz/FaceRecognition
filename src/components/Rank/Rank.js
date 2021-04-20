import React from "react";

const Rank = ({ userEntries, userName }) => {
  return (
    <div>
      <div className="white f3">{`${userName}, your current entries count is... `}</div>
      <div className="white f1">{userEntries}</div>
    </div>
  );
};

export default Rank;
