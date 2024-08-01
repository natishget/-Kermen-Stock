import purchase from '../assets/icons/purchase.svg';
import { useState, useEffect } from 'react';

const Card = ({ name, value }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (count <= 100) {
        setCount((prevCount) => prevCount + 4);
      } else {
        clearInterval(interval);
      }
    }, 0.1);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <div className="border rounded-xl border-slate-600 flex justify-center items-center bg-mycolor mx-3 py-2">
        <img src={purchase} alt="small" className="w-9" />
        <div className="pl-3">
          <p>{name}</p>
          <p className="text-yellow-400">{value}</p>
        </div>
      </div>
    </>
  );
};

export default Card;
