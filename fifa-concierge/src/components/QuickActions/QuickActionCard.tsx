import React, { useState } from 'react';
import { LucideIcon } from 'lucide-react';
import { QuickAction } from '../../types/quickActions';
import './QuickActions.css';

interface QuickActionCardProps {
  action: QuickAction;
}

export const QuickActionCard: React.FC<QuickActionCardProps> = ({ action }) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = () => {
    setIsPressed(true);
    action.handler();
    
    // Reset pressed state after animation
    setTimeout(() => setIsPressed(false), 200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  const Icon = action.icon as LucideIcon;

  return (
    <button
      className={`quick-action-card ${isPressed ? 'pressed' : ''}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      style={{
        background: action.gradient || action.color,
      }}
      aria-label={`${action.title}: ${action.subtitle}`}
      role="button"
      tabIndex={0}
    >
      <div className="quick-action-icon-wrapper">
        <Icon className="quick-action-icon" size={32} strokeWidth={2} />
      </div>
      
      <div className="quick-action-content">
        <h3 className="quick-action-title">{action.title}</h3>
        <p className="quick-action-subtitle">{action.subtitle}</p>
      </div>

      <div className="quick-action-arrow">
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 20 20" 
          fill="none"
          aria-hidden="true"
        >
          <path 
            d="M7 4L13 10L7 16" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </button>
  );
};
