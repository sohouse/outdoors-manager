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
        <p>后端（包含活动(难度、地点、人数上限)、领队、车辆(车辆信息、座位数、绑定活动、分配记录)、物资、订单、用户、排期）</p>
        <p>用户端（活动、下单、我的订单）</p>
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