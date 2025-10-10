import { useState, useEffect } from 'react';

export function usePerformanceMode() {
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Check if device is mobile (viewport width)
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Check for reduced motion preference
    const checkReducedMotion = () => {
      setPrefersReducedMotion(
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      );
    };

    // Check if device supports touch
    const checkTouchDevice = () => {
      setIsTouchDevice(
        'ontouchstart' in window || navigator.maxTouchPoints > 0
      );
    };

    // Initial checks
    checkMobile();
    checkReducedMotion();
    checkTouchDevice();

    // Listen for resize events
    window.addEventListener('resize', checkMobile);

    // Listen for reduced motion changes
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => checkReducedMotion();
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      window.removeEventListener('resize', checkMobile);
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  // Calculate optimized animation settings
  const getAnimationConfig = () => {
    if (prefersReducedMotion) {
      return {
        duration: 0,
        delay: 0,
        staggerDelay: 0,
        enableHover: false,
        enableComplex: false,
      };
    }

    if (isMobile) {
      return {
        duration: 0.4, // Reduced from 0.8s
        delay: 0.1,
        staggerDelay: 0.05, // Reduced from 0.1s
        enableHover: false,
        enableComplex: false, // Disable complex animations on mobile
      };
    }

    // Desktop - full animations
    return {
      duration: 0.8,
      delay: 0.2,
      staggerDelay: 0.1,
      enableHover: true,
      enableComplex: true,
    };
  };

  return {
    isMobile,
    isTouchDevice,
    prefersReducedMotion,
    ...getAnimationConfig(),
  };
}
