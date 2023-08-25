import rectangulo from '@assets/salgar/rectangulo.png'

type Props = {
  img: string
  text: string
  onClick: () => void
  height: number
  width: number
}

export function ToolbarButton({ img, text, onClick, height = 60, width = 60 }: Props) {
  return (
    <div
      onClick={onClick}
      className='relative mt-[15px] flex min-h-[9.5em] w-full cursor-pointer items-center justify-center text-[10px]'
    >
      <div className='flex flex-col items-center justify-center'>
        <div className='relative'>
          <img
            className='toolbar-button absolute -ml-20 -mt-2 h-24 w-40 max-w-none opacity-0 hover:opacity-20'
            src={rectangulo}
          />
        </div>
        <div className='flex flex-col items-center justify-center'>
          <img
            style={{ height, width }}
            src={img}
          />
          <p className='mx-0 my-2 text-[10px] text-C/Color3'>{text}</p>
        </div>
      </div>
    </div>
  )
}
