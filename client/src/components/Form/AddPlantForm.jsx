import { useImageApi } from "../ImageApi/useImageApi"
import useAuth from "../../hooks/useAuth"
import useAxiosSecure from "../../hooks/useAxiosSecure"
import toast from "react-hot-toast"
import { useState } from "react"
import { TbFidgetSpinner } from 'react-icons/tb'
import { useNavigate } from "react-router-dom"


const AddPlantForm = () => {
  const { user } = useAuth()
  const axiosSecure = useAxiosSecure()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const [uploadImage, setUploadImage] = useState({ name: 'Upload Button' })
  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    const form = e.target
    const name = form.name.value
    const description = form.description.value
    const category = form.category.value
    if (!uploadImage?.image) {
      setLoading(false)
      return toast.error('please add image..')
    }
    const imageUrl = await useImageApi(uploadImage?.image)
    const price = parseFloat(form.price.value)
    const quantity = parseInt(form.quantity.value)
    const sellerEmail = user?.email
    const sellerPhotoUrl = user?.photoURL
    const sellerName = user?.displayName
    const sellerInfo = { sellerEmail, sellerPhotoUrl, sellerName }
    const plantData = { name, description, category, price, image: imageUrl, quantity, sellerInfo }

    try {
      axiosSecure.post('http://localhost:5000/plants', plantData)
        .then(res => {
          if (res.data.insertedId) {
            toast.success('added successfully done !')
            navigate('/')
          }
        })
        .catch(err => {
          console.log(err);
        })
    } catch (error) {
      console.log(error);
    }
    finally {
      setLoading(false)
    }

  }
  return (
    <div className='w-full min-h-[calc(100vh-40px)] flex flex-col justify-center items-center text-gray-800 rounded-xl bg-gray-50'>
      <form onSubmit={handleSubmit}>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-10'>
          <div className='space-y-6'>
            {/* Name */}
            <div className='space-y-1 text-sm'>
              <label htmlFor='name' className='block text-gray-600'>
                Name
              </label>
              <input
                className='w-full px-4 py-3 text-gray-800 border border-lime-300 focus:outline-lime-500 rounded-md bg-white'
                name='name'
                id='name'
                type='text'
                placeholder='Plant Name'
                required
              />
            </div>
            {/* Category */}
            <div className='space-y-1 text-sm'>
              <label htmlFor='category' className='block text-gray-600 '>
                Category
              </label>
              <select
                required
                className='w-full px-4 py-3 border-lime-300 focus:outline-lime-500 rounded-md bg-white'
                name='category'
              >
                <option value='Indoor'>Indoor</option>
                <option value='Outdoor'>Outdoor</option>
                <option value='Succulent'>Succulent</option>
                <option value='Flowering'>Flowering</option>
              </select>
            </div>
            {/* Description */}
            <div className='space-y-1 text-sm'>
              <label htmlFor='description' className='block text-gray-600'>
                Description
              </label>

              <textarea
                id='description'
                placeholder='Write plant description here...'
                className='block rounded-md focus:lime-300 w-full h-32 px-4 py-3 text-gray-800  border border-lime-300 bg-white focus:outline-lime-500 '
                name='description'
              ></textarea>
            </div>
          </div>
          <div className='space-y-6 flex flex-col'>
            {/* Price & Quantity */}
            <div className='flex justify-between gap-2'>
              {/* Price */}
              <div className='space-y-1 text-sm'>
                <label htmlFor='price' className='block text-gray-600 '>
                  Price
                </label>
                <input
                  className='w-full px-4 py-3 text-gray-800 border border-lime-300 focus:outline-lime-500 rounded-md bg-white'
                  name='price'
                  id='price'
                  type='number'
                  placeholder='Price per unit'
                  required
                />
              </div>

              {/* Quantity */}
              <div className='space-y-1 text-sm'>
                <label htmlFor='quantity' className='block text-gray-600'>
                  Quantity
                </label>
                <input
                  className='w-full px-4 py-3 text-gray-800 border border-lime-300 focus:outline-lime-500 rounded-md bg-white'
                  name='quantity'
                  id='quantity'
                  type='number'
                  placeholder='Available quantity'
                  required
                />
              </div>
            </div>

            {/* Image */}
            <div className=' p-4  w-full  m-auto rounded-lg flex-grow'>
              <div className='file_upload px-5 py-3 relative border-4 border-dotted border-gray-300 rounded-lg'>
                {/* show image and info  */}
                {uploadImage && uploadImage?.image?.size && (
                  <div className='flex gap-5 relative items-center'>
                    <img className='w-20' src={uploadImage?.url} alt='' />
                    <button onClick={() => setUploadImage({ name: "Upload Button" })} className="absolute p-3 flex items-center justify-center hover:bg-red-400 -top-3 -left-3 w-6 h-6 rounded-full text-white bg-red-300">X</button>
                    <p>Image Size: {uploadImage?.image?.size} Bytes</p>
                  </div>
                )}
                {/* {image && <img className="h-20 mx-auto mb-2" src={image} alt="" />} */}

                <div className='flex flex-col w-max mx-auto text-center'>
                  <label>
                    <input
                      className='text-sm cursor-pointer w-36 hidden'
                      type='file'
                      name='image'
                      // onChange={(e) => handleSetImage(e.target.files[0])}
                      onChange={e =>
                        setUploadImage({
                          image: e.target.files[0],
                          url: URL.createObjectURL(e.target.files[0]),
                        })
                      }
                      id='image'
                      accept='image/*'
                      hidden
                    />
                    <div className='bg-lime-500 text-white border border-gray-300 rounded font-semibold cursor-pointer p-1 px-3 hover:bg-lime-500'>
                      {uploadImage?.image?.name ? uploadImage?.image?.name : 'Update'}
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type='submit'
              className='w-full p-3 mt-5 text-center font-medium text-white transition duration-200 rounded shadow-md bg-lime-500 '
            >
              {loading ? (
                <TbFidgetSpinner className='animate-spin m-auto' />
              ) : (
                'Save & Continue'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default AddPlantForm
