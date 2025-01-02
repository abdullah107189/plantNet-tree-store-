import Card from './Card'
import Container from '../Shared/Container'
import useAxiosSecure from '../../hooks/useAxiosSecure'
import { useEffect, useState } from 'react'

const Plants = () => {
  const axiosSecure = useAxiosSecure()
  const [plants, setPlants] = useState([])
  useEffect(() => {
    axiosSecure.get('/plants')
      .then(res => {
        setPlants(res.data)
      })
  }, [])
  return (
    <Container>
      <div className='pt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8'>
        {
          plants?.map(plant => <Card plant={plant} key={plant?._id} />)
        }
      </div>
    </Container>
  )
}

export default Plants
