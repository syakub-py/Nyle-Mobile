import ImageViewer from 'react-native-image-zoom-viewer';


export default function ViewImages({route, navigation}){
    const images = route.params.pictures;
    const getImages = (array) =>{
        const result = []
        array.map((image)=>{
            result.push({url: image})
        })
        return result
    }

    return (
        <ImageViewer 
        imageUrls={getImages(images)}
        enableSwipeDown={true}
        onSwipeDown={() => {navigation.goBack()}}
        index={route.params.index}
        backgroundColor='transparent'
        />
    );
}