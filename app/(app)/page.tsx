import Image from 'next/image'

const RootPage = () => {
  return (
    <div className="flex justify-center items-center">
      <div
        className="rounded-full overflow-hidden"
        style={{
          maskImage: 'radial-gradient(circle, white 40%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(circle, white 40%, transparent 70%)'
        }}
      >
        <Image
          alt=''
          width={500}
          height={300}
          src='/images/lion.png'
          className='rounded-full'
        />
      </div>
    </div>
  )
}

export default RootPage