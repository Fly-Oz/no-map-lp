'use client'

import { useEffect } from 'react'

/**
 * Attaches an IntersectionObserver to elements that should animate
 * in when they enter the viewport. Adds the `in-view` class when
 * triggered (CSS handles the actual transition).
 */
export default function AnimationObserver() {
  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>(
      '.how-step, .why-card, .value-acc-item'
    )

    if (!('IntersectionObserver' in window)) {
      // Fallback: just show everything immediately
      targets.forEach(el => el.classList.add('in-view'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view')
            observer.unobserve(entry.target) // fire once only
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )

    targets.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return null
}
