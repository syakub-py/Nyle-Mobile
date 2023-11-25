import {useContext} from 'react';
import {AppContext} from '../Contexts/NyleContext';

export default function findPost(postId) {
  const nyleContext = useContext(AppContext);
  return nyleContext.contextFor(postId);
}
