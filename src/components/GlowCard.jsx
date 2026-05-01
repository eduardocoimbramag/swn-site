import React from 'react';

const GlowCard = ({ title, description, items }) => {
  return (
    <div className="glow-card">
      <h3>{title}</h3>
      <p>{description}</p>
      <ul className="glow-card-items">
        {items.map((item, index) => (
          <li key={index}>
            <span className="item-dot"></span> {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GlowCard;