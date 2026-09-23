import { useState, useEffect, useCallback } from 'react';

export function useCountdown(initialSeconds: number = 45) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;

    const intervalId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isActive, timeLeft]);

  const startTimer = useCallback(() => {
    setTimeLeft(initialSeconds);
    setIsActive(true);
  }, [initialSeconds]);

  const resetTimer = useCallback(() => {
    setTimeLeft(initialSeconds);
  }, [initialSeconds]);

  const formatTime = useCallback(() => {
    const seconds = timeLeft < 10 ? `0${timeLeft}` : timeLeft;
    return `00:${seconds}`;
  }, [timeLeft]);

  return { timeLeft, startTimer, resetTimer, formatTime };
}
