import React, { useEffect, useRef } from 'react';

const InteractiveCursor: React.FC = () => {
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorOutlineRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number | undefined>(undefined);
  
  // Use refs for positions to avoid re-renders on mouse move
  const mousePosRef = useRef({ x: -100, y: -100 });
  const outlinePosRef = useRef({ x: -100, y: -100 });
  const lerpFactor = 0.15; // Controls the trailing smoothness

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mousePosRef.current = { x: event.clientX, y: event.clientY };
    };

    const handleMouseOver = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.closest('a, button, input, textarea, select, [data-interactive]')) {
            cursorDotRef.current?.classList.add('hover');
            cursorOutlineRef.current?.classList.add('hover');
        }
    };

    const handleMouseOut = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.closest('a, button, input, textarea, select, [data-interactive]')) {
            cursorDotRef.current?.classList.remove('hover');
            cursorOutlineRef.current?.classList.remove('hover');
        }
    };

    const handleMouseDown = () => {
      cursorOutlineRef.current?.classList.add('click');
    };

    const handleMouseUp = () => {
      cursorOutlineRef.current?.classList.remove('click');
    };

    // Set up all event listeners
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    
    // Start the animation loop
    const animate = () => {
      const dot = cursorDotRef.current;
      const outline = cursorOutlineRef.current;
      if (dot && outline) {
        // Move dot directly
        dot.style.left = `${mousePosRef.current.x}px`;
        dot.style.top = `${mousePosRef.current.y}px`;
        
        // Smoothly move outline (lerp)
        outlinePosRef.current.x += (mousePosRef.current.x - outlinePosRef.current.x) * lerpFactor;
        outlinePosRef.current.y += (mousePosRef.current.y - outlinePosRef.current.y) * lerpFactor;

        outline.style.left = `${outlinePosRef.current.x}px`;
        outline.style.top = `${outlinePosRef.current.y}px`;
      }
      requestRef.current = requestAnimationFrame(animate);
    };
    
    requestRef.current = requestAnimationFrame(animate);

    // Cleanup function
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      if(requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []); // Empty dependency array ensures this effect runs only once


  return (
    <>
      <div ref={cursorDotRef} className="cursor-dot"></div>
      <div ref={cursorOutlineRef} className="cursor-outline"></div>
    </>
  );
};

export default InteractiveCursor;
