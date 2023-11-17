import { useEffect, useRef, useState } from "react";

export default function useOnTripleClicked(onClick: () => void) {
  const ref = useRef<HTMLImageElement>(null);
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    const element = ref.current;
    const clickEventListener = () => {
      const prevClickCount = clickCount;
      setClickCount(prevClickCount + 1);
      if (prevClickCount + 1 > 2) {
        onClick();
      }
      setTimeout(() => {
        setClickCount(0);
      }, 500);
    };

    if (element) {
      element.addEventListener("click", clickEventListener);
    }

    return () => {
      if (element) {
        element.removeEventListener("click", clickEventListener);
      }
    };
  }, [onClick]); // eslint-disable-line react-hooks/exhaustive-deps

  return ref;
}
