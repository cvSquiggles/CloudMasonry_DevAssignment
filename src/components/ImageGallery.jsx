import { useState } from 'react'
import { RowsPhotoAlbum } from 'react-photo-album'

//Lightbox imports
import Lightbox from "yet-another-react-lightbox"
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen"
import { Thumbnails } from 'yet-another-react-lightbox/plugins'
import Captions from "yet-another-react-lightbox/plugins/captions"
import "yet-another-react-lightbox/styles.css"
import "yet-another-react-lightbox/plugins/captions.css"

import img1 from "../images/image_1.jpg"
import img2 from "../images/image_2.jpg"

import usePhotoStore from "../store/usePhotoStore"


export function ImageGallery(photos) {

    const [index, setIndex] = useState(-1)

    const photoStore = usePhotoStore((state) => state.photos) //local variable for accessing our global photo store array

    // const photos = [
    //     {src: img1, width: 500, height: 500},
    //     {src: img2, width: 500, height: 500},
    // ]


  return (
    <>
        <RowsPhotoAlbum photos={photoStore} onClick={({ index }) => setIndex(index)}/>

        {/*Building lightbox with the photo album, since they'll always go together !!!slides, not slide ughhhh*/}
        <Lightbox slides={photoStore}
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        /*plugins to modify default*/
        plugins={[Fullscreen, Captions, Thumbnails]}
        />
        
        </>
  )
}

export default ImageGallery