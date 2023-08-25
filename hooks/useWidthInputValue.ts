import { useEffect, useMemo, useRef, useState } from 'react'

export function useWidthInputValue(width: number, id: string) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [value, setValue] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const modifiedValue = useMemo(() => width, [width])

  useEffect(() => {
    setValue(width)
    setIsTyping(false)
  }, [id, modifiedValue])

  useEffect(() => inputRef.current?.focus(), [id])

  useEffect(() => {
    if (!isTyping && inputRef.current === document.activeElement) {
      inputRef.current?.select()
    }
  })

  return { value, setValue, inputRef, setIsTyping }
}
