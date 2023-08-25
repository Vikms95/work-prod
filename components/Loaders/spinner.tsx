import { motion } from 'framer-motion'
import { useAppStore } from '@store'

export function Spinner() {
  const t = useAppStore.use.t()
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className=' pointer-events-none'
    >
      <div
        aria-label='Loading...'
        role='status'
        className=' white-background flew-row absolute left-1/2 top-1/2 z-50 flex -translate-x-1/2 -translate-y-1/2 items-center justify-evenly space-x-2 rounded-xl border-4 border-C/Color3 bg-white p-4'
      >
        <svg
          className='ml-4 mr-16 h-16 w-16 animate-spin stroke-C/Color3'
          viewBox='0 0 256 256'
        >
          <line
            x1='128'
            y1='32'
            x2='128'
            y2='64'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='24'
          ></line>
          <line
            x1='195.9'
            y1='60.1'
            x2='173.3'
            y2='82.7'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='24'
          ></line>
          <line
            x1='224'
            y1='128'
            x2='192'
            y2='128'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='24'
          ></line>
          <line
            x1='195.9'
            y1='195.9'
            x2='173.3'
            y2='173.3'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='24'
          ></line>
          <line
            x1='128'
            y1='224'
            x2='128'
            y2='192'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='24'
          ></line>
          <line
            x1='60.1'
            y1='195.9'
            x2='82.7'
            y2='173.3'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='24'
          ></line>
          <line
            x1='32'
            y1='128'
            x2='64'
            y2='128'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='24'
          ></line>
          <line
            x1='60.1'
            y1='60.1'
            x2='82.7'
            y2='82.7'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='24'
          ></line>
        </svg>
        <span className=' text-2xl font-medium text-C/Color3'>{t('MSG_215')}</span>
      </div>
    </motion.div>
  )
}
