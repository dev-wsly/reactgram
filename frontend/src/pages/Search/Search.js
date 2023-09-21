import './Search.css'

// Hooks
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useResetComponentMessage } from './../../hooks/useResetComponentMessage';
import { useQuery } from '../../hooks/useQuery';

// Components
import LikeContainer from './../../components/LikeContainer';
import PhotoItem from './../../components/PhotoItem';
import { Link } from 'react-router-dom';

// Redux
import { like, searchPhotos } from '../../slices/photoSlice';

const Search = () => {
    const query = useQuery()
    const search = query.get('q')

    const dispatch = useDispatch()
    const resetMessage = useResetComponentMessage(dispatch)
    const {user} = useSelector(state => state.auth)
    const {photos, loading} = useSelector(state => state.photo)

    // Load photos
    useEffect(() => {
        dispatch(searchPhotos(search))
    }, [dispatch, search])

    const handleLike = (photo) => {
        dispatch(like(photo._id))
        resetMessage()
      }
    
      if (loading)
        return <p>Carregando...</p>

  return (
    <div id='search'>
      {photos > 0 && photos.map(photo => (
          <div key={photo._id}>
              <PhotoItem photo={photo}/>
              <LikeContainer photo={photo} user={user} handleLike={handleLike}/>
              <Link className='btn' to={`/photos/${photo._id}`} >Ver mais detalhes</Link>
          </div>
      ))}

      <h2>Você está buscando por: {search}</h2>
      {photos.length === 0 && (
        <h2 className='no-photos'>
          Não foram encontrados resultados para a sua busca
        </h2>
      )}
    </div>
  )
}

export default Search