import {useContext} from 'react';
import {AppContext} from '../Contexts/NyleContext';


export default function usePostContext(postTitle) {
  const nyleContext = useContext(AppContext);
  return nyleContext.contextFor(postTitle);
}
