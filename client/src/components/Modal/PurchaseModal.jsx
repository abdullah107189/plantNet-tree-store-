/* eslint-disable react/prop-types */
import {
  Dialog,
  Transition,
  TransitionChild,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react'
import { Fragment, useState } from 'react'
import useAuth from '../../hooks/useAuth'
import toast from 'react-hot-toast'
import Button from '../Shared/Button/Button'
import useAxiosSecure from '../../hooks/useAxiosSecure'


const PurchaseModal = ({ closeModal, isOpen, plant, setError, error, totalPrice, setTotalPrice }) => {
  const { name, category, price, quantity, image, _id, sellerInfo } = plant || {}
  const [totalQuantity, setTotalQuantity] = useState(1)
  const { user } = useAuth()
  const [address, setAddress] = useState('')
  const axiosSecure = useAxiosSecure()

  const handleChangeValue = value => {
    if (value > quantity) {
      setError(true)
      toast.error('Plant exceeds available stock!')
      return
    }
    if (1 > value) {
      setError(true)
      toast.error('minimum 1pis')
      return
    }
    setError(false)
    setTotalQuantity(value)
    setTotalPrice(value * price)
  }

  const purchaseInfo = {
    customer: {
      name: user?.displayName,
      email: user?.email,
      photo: user?.photoURL
    },
    plantId: _id,
    plantName: name,
    plantCategory: category,
    plantPrice: totalPrice,
    plantQuantity: totalQuantity,
    plantImage: image,
    sellerEmail: sellerInfo?.sellerEmail,
    status: 'pending',
  }
  const handlePurchase = async () => {
    if (address === '') {
      return toast.error('please fill up address input')
    }
    purchaseInfo.customer.address = address
    try {
      const { data } = await axiosSecure.post('/orders', purchaseInfo)
      if (data.insertedId) {
        toast.success('Order proccess')
      }
      
    } catch (error) {
      console.log(error);
    }
    finally {
      closeModal()
    }
  }
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-10' onClose={closeModal}>
        <TransitionChild
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black bg-opacity-25' />
        </TransitionChild>

        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4 text-center'>
            <TransitionChild
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <DialogPanel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                <DialogTitle
                  as='h3'
                  className='text-lg font-medium text-center leading-6 text-gray-900'
                >
                  Review Info Before Purchase
                </DialogTitle>
                <div className='mt-2'>
                  <p className='text-sm text-gray-500'>Plant: {name}</p>
                </div>
                <div className='mt-2'>
                  <p className='text-sm text-gray-500'>Category: {category}</p>
                </div>
                <div className='mt-2'>
                  <p className='text-sm text-gray-500'>Customer: {user?.displayName}</p>
                </div>

                <div className='mt-2'>
                  <p className='text-sm text-gray-500'>Price: $ {price}</p>
                </div>
                <div className='mt-2'>
                  <p className='text-sm text-gray-500'>Available Quantity: {quantity}</p>
                </div>
                <div className='flex items-center space-x-3 text-sm'>
                  <label htmlFor='quantity' className='block text-gray-600'>
                    Quantity :
                  </label>
                  <input
                    defaultValue={totalQuantity}
                    onChange={(e) => handleChangeValue(parseInt(e.target.value) || 0)}
                    className={`${error && 'text-red-400'} w-auto p-2 mt-1 text-gray-800 border border-lime-300 focus:outline-lime-500 rounded-md bg-white`}
                    name='quantity'
                    id='quantity'
                    min="0"
                    type='number'
                    placeholder='Available quantity'
                    required
                  />
                </div>
                <div className='flex items-center space-x-3 text-sm'>
                  <label htmlFor='address' className='block text-gray-600'>
                    Address :
                  </label>
                  <input
                    className='mb-3 w-auto p-2 mt-1 text-gray-800 border border-lime-300 focus:outline-lime-500 rounded-md bg-white'
                    required
                    name='address'
                    id='address'
                    onChange={(e) => setAddress(e.target.value)}
                    type='text'
                    placeholder='Write your address here...'
                  />
                </div>
                <Button onClick={handlePurchase} label={`Pay $${totalPrice || price}`} />
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default PurchaseModal
