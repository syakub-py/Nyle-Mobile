import {useContext} from 'react';
import {AppContext} from '../Contexts/Context';


export default function usePostContext(postTitle) {
  const nyleContext = useContext(AppContext);
  return nyleContext.contextFor(postTitle);
}
