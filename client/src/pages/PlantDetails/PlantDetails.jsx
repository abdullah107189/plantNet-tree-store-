import Container from '../../components/Shared/Container'
import { Helmet } from 'react-helmet-async'
import Heading from '../../components/Shared/Heading'
import Button from '../../components/Shared/Button/Button'
import PurchaseModal from '../../components/Modal/PurchaseModal'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import useAxiosSecure from '../../hooks/useAxiosSecure'

const PlantDetails = () => {
  let [isOpen, setIsOpen] = useState(false)

  const [plant, setPlant] = useState({})
  const closeModal = () => {
    setIsOpen(false)
  }

  const { id } = useParams()
  const axiosSecure = useAxiosSecure()

  useEffect(() => {
    axiosSecure.get(`/plants/${id}`)
      .then(res => {
        setPlant(res.data)
      })
  }, [])
  const { name, category, price, image, quantity, sellerInfo, description } = plant || {}
  return (
    <Container>
      <Helmet>
        <title>{name}</title>
      </Helmet>
      <div className='mx-auto flex flex-col lg:flex-row justify-between w-full gap-12'>
        {/* Header */}
        <div className='flex flex-col gap-6 flex-1'>
          <div>
            <div className='w-full overflow-hidden rounded-xl'>
              <img
                className='object-cover md:w-2/3'
                src={image}
                alt={name}
              />
            </div>
          </div>
        </div>
        <div className='md:gap-10 flex-1'>
          {/* Plant Info */}
          <Heading
            title={'Money Plant'}
            subtitle={`Category: ${category}`}
          />
          <hr className='my-6' />
          <div
            className='
          text-lg font-light text-neutral-500'
          >{description}
          </div>
          <hr className='my-6' />

          <div
            className='
                text-xl 
                font-semibold 
                flex 
                flex-row 
                items-center
                gap-2
              '
          >
            <div>Seller: {sellerInfo?.sellerName ? sellerInfo.sellerName : 'Seller Name null'}</div>

            <img
              className='rounded-full'
              height='30'
              width='30'
              alt='Avatar'
              referrerPolicy='no-referrer'
              src={sellerInfo?.sellerPhotoUrl ? sellerInfo.sellerPhotoUrl : 'Seller photo null'}
            />
          </div>
          <hr className='my-6' />
          <div>
            <p
              className='
                gap-4 
                font-light
                text-neutral-500
              '
            >
              Quantity: {quantity} Units Left Only!
            </p>
          </div>
          <hr className='my-6' />
          <div className='flex justify-between'>
            <p className='font-bold text-3xl text-gray-500'>Price: {price}$</p>
            <div>
              <Button label='Purchase' />
            </div>
          </div>
          <hr className='my-6' />

          <PurchaseModal closeModal={closeModal} isOpen={isOpen} />

          <div className='md:col-span-3 order-first md:order-last mb-10'>
            {/* RoomReservation */}
            {/* <RoomReservation room={room} /> */}
          </div>
        </div>
      </div>
    </Container>
  )
}

export default PlantDetails
