import React from 'react';

interface LoaderProps {
  slow?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ slow = false }) => {
  const duration = slow ? '4s' : '2.5s';
  
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/95 backdrop-blur-sm transition-opacity duration-300">
      <style>
        {`
          @keyframes drawLogo {
            0% {
              stroke-dashoffset: 1000;
              fill: transparent;
            }
            70% {
              stroke-dashoffset: 0;
              fill: transparent;
            }
            100% {
              stroke-dashoffset: 0;
              fill: #EC0000;
            }
          }

          .santander-path-animation {
            stroke: #EC0000;
            stroke-width: 1.2;
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-dasharray: 1000;
            stroke-dashoffset: 1000;
            animation: drawLogo ${duration} ease-in-out infinite;
          }
        `}
      </style>
      
      <div className="flex flex-col items-center">
        <svg 
          width="80" 
          height="80" 
          viewBox="-10 -10 71.75 68.81" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            className="santander-path-animation"
            d="M26.21 0c0.24,1.17 0.67,2.3 1.28,3.36l8.11 13.91c0.91,1.58 1.41,3.33 1.49,5.08 8.67,2.25 14.66,7.02 14.66,12.54 0,7.69 -11.59,13.92 -25.88,13.92 -14.29,0 -25.87,-6.23 -25.87,-13.92 0,-5.52 5.99,-10.29 14.66,-12.53 -0.09,2.08 0.4,4.18 1.49,6.04l8.1 13.91c0.62,1.06 1.05,2.2 1.29,3.37l0.33 -0.58c2.01,-3.45 2.01,-7.69 0,-11.13l-6.5 -11.17c-1.98,-3.43 -1.98,-7.66 0.02,-11.09l0.34 -0.58c0.24,1.16 0.66,2.3 1.28,3.36l9.72 16.69c0.62,1.07 1.05,2.2 1.29,3.37l0.33 -0.58c2.01,-3.45 2.01,-7.69 0,-11.13l-6.48 -11.13c-2,-3.44 -2,-7.69 0,-11.13l0.34 -0.58z"
          />
        </svg>
      </div>
    </div>
  );
};

export default Loader;