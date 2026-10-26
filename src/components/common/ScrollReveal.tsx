import React, { useEffect, useRef, useState } from 'react';

export type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'none';

export interface ScrollRevealProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  children: React.ReactNode;
  direction?: RevealDirection;
  distance?: number; // in pixels
  duration?: number; // in milliseconds
  delay?: number; // in milliseconds
  threshold?: number; // 0 to 1
  rootMargin?: string;
  once?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * ScrollReveal Component
 * Smooth, hardware-accelerated fade-in reveal effect when elements scroll into view.
 * Fully supports prefers-reduced-motion for accessibility.
 */
export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  as: Component = 'div',
  children,
  direction = 'up',
  distance = 28,
  duration = 700,
  delay = 0,
  threshold = 0.12,
  rootMargin = '0px 0px -40px 0px',
  once = true,
  className = '',
  style = {},
  ...restProps
}) => {
  const elementRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check user preference for reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMediaChange);
    } else {
      mediaQuery.addListener(handleMediaChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleMediaChange);
      } else {
        mediaQuery.removeListener(handleMediaChange);
      }
    };
  }, []);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    // If reduced motion is preferred, reveal immediately
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once) {
              observer.unobserve(entry.target);
            }
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, once, prefersReducedMotion]);

  // Compute transform translation based on direction
  const getTransform = () => {
    if (isVisible || prefersReducedMotion || direction === 'none') {
      return 'translate3d(0, 0, 0)';
    }

    switch (direction) {
      case 'up':
        return `translate3d(0, ${distance}px, 0)`;
      case 'down':
        return `translate3d(0, -${distance}px, 0)`;
      case 'left':
        return `translate3d(${distance}px, 0, 0)`;
      case 'right':
        return `translate3d(-${distance}px, 0, 0)`;
      default:
        return 'translate3d(0, 0, 0)';
    }
  };

  const dynamicStyle: React.CSSProperties = prefersReducedMotion
    ? style
    : {
        ...style,
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transitionProperty: 'opacity, transform',
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)', // Smooth natural spring-like deceleration
        transitionDelay: `${delay}ms`,
        willChange: isVisible ? 'auto' : 'opacity, transform',
      };

  return (
    <Component
      ref={elementRef}
      className={`scroll-reveal-container ${isVisible ? 'is-revealed' : ''} ${className}`}
      style={dynamicStyle}
      {...restProps}
    >
      {children}
    </Component>
  );
};
