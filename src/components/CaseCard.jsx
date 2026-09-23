import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowUpRight } from 'react-icons/fi';
import CaseImage from './CaseImage';

const swanEase = [0.22, 1, 0.36, 1];

/**
 * CaseCard — square image + caption used by the /cases listings:
 * categories (index) and projects (each category's gallery).
 * White title, bold lead line and a gray description.
 */
const CaseCard = ({
  to,
  tag,
  title,
  lead,
  text,
  accent,
  mockup,
  headingLevel = 'h2',
  index = 0
}) => {
  const Heading = headingLevel;

  return (
    <motion.article
      className="cases-index-card"
      initial={{ opacity: 0, y: 32, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.9, delay: (index % 3) * 0.08, ease: swanEase }}
    >
      <Link to={to} className="cases-index-card-link">
        <div className="cases-index-card-media">
          <CaseImage accent={accent} mockup={mockup} variant="card" />
          {tag && <span className="cases-index-card-tag">{tag}</span>}
        </div>
        <div className="cases-index-card-body">
          <Heading className="cases-index-card-title">
            {title}
            <FiArrowUpRight size={18} aria-hidden="true" className="cases-index-card-arrow" />
          </Heading>
          <p>
            {lead && <strong>{lead}</strong>}
            {lead && ' '}
            <span>{text}</span>
          </p>
        </div>
      </Link>
    </motion.article>
  );
};

export default CaseCard;
