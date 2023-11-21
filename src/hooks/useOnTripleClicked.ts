import { useEffect, useRef, useState } from "react";

const CLICK_DELAY_MS = 300;

export default function useOnTripleClicked(
  onTripleClick: () => void,
  onSingleClick: () => void
) {
  const ref = useRef<HTMLImageElement>(null);
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    const element = ref.current;
    const clickEventListener = () => {
      setClickCount((prev) => prev + 1);
    };

    if (element) {
      element.addEventListener("click", clickEventListener);
    }

    return () => {
      if (element) {
        element.removeEventListener("click", clickEventListener);
      }
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (clickCount === 1) {
        onSingleClick();
      }
      setClickCount(0);
    }, CLICK_DELAY_MS);

    if (clickCount === 3) {
      onTripleClick();
    }
    return () => clearTimeout(timer);
  }, [clickCount]); // eslint-disable-line react-hooks/exhaustive-deps

  return ref;
}
