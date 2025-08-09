import React, { useEffect } from 'react';

interface BackgroundProps {
  theme: number;
}

const Background: React.FC<BackgroundProps> = ({ theme }) => {
  useEffect(() => {
    const starsContainer = document.getElementById('stars-container');
    const meteorsContainer = document.getElementById('meteors-container');
    if (!starsContainer || !meteorsContainer || starsContainer.children.length > 0) return;

    // --- Create Floating Stars ---
    const floatingStarCount = 100;
    const floatingFragment = document.createDocumentFragment();
    for (let i = 0; i < floatingStarCount; i++) {
      const star = document.createElement('div');
      star.className = 'floating-star';
      const size = Math.random() * 2 + 1;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.left = `${Math.random() * 100}%`;
      star.style.animationDuration = `${Math.random() * 15 + 10}s`;
      star.style.animationDelay = `${Math.random() * 10}s`;
      floatingFragment.appendChild(star);
    }
    starsContainer.appendChild(floatingFragment);

    // --- Create Twinkling Stars (static positions) ---
    const twinklingStarCount = 200;
    const twinklingFragment = document.createDocumentFragment();
    for (let i = 0; i < twinklingStarCount; i++) {
        const star = document.createElement('div');
        star.className = 'twinkling-star';
        const size = Math.random() * 1.5 + 0.5;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDuration = `${Math.random() * 5 + 3}s`;
        star.style.animationDelay = `${Math.random() * 5}s`;
        twinklingFragment.appendChild(star);
    }
    starsContainer.appendChild(twinklingFragment);
    
    // --- Create Meteors ---
    const meteorCount = 7;
    const meteorFragment = document.createDocumentFragment();
    for(let i=0; i < meteorCount; i++) {
        const meteor = document.createElement('div');
        meteor.className = 'meteor';
        // Position is handled by CSS centering and transform animation
        meteor.style.animationDelay = `${Math.random() * 15}s`;
        meteor.style.animationDuration = `${Math.random() * 4 + 3}s`;
        meteorFragment.appendChild(meteor);
    }
    meteorsContainer.appendChild(meteorFragment);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div id="background-container" className={`theme-${theme}`}>
      <div className="galaxy galaxy-1"></div>
      <div className="galaxy galaxy-2"></div>
      <div className="galaxy galaxy-3"></div>
      <div className="galaxy galaxy-4"></div>
      <div className="galaxy galaxy-5"></div>
      <div className="galaxy galaxy-6"></div>
      <div id="stars-container" className="absolute inset-0"></div>
      <div id="meteors-container" className="absolute inset-0 w-full h-full overflow-hidden"></div>
    </div>
  );
};

export default Background;
