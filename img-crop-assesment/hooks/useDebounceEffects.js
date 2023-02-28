import { useEffect } from 'react'

export function useDebounceEffect(
  cb,
  waitTime,
  dps,
) {
  useEffect(() => {
    const t = setTimeout(() => {
      cb.apply(undefined, dps)
    }, waitTime)

    return () => {
      clearTimeout(t)
    }
  }, dps)
}