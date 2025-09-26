import React, { useEffect, useRef } from 'react';
import { ClipLoader } from 'react-spinners'; 
import Strings from '../util/Strings';

const LoadingWrapper: React.FC<{ isLoading: boolean; children: React.ReactNode }> = ({ isLoading, children }) => {
  const loadingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoading && loadingRef.current) {
      loadingRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isLoading]);

  return (
    <div>
      {isLoading ? (
        <div ref={loadingRef} className="flex flex-col justify-center items-center mt-5">
          <ClipLoader color="#09f" size={64} />
          <p className="mt-3 text-lg font-semibold">{Strings.carregando}</p>
        </div>
      ) : (
        <>{children}</>
      )}
    </div>
  );
};

export default LoadingWrapper;
