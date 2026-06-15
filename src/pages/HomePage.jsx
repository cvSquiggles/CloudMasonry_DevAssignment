import { useState } from 'react'


import YearPicker from '../components/YearPicker'
import ImageGallery from '../components/ImageGallery'
import usePhotoStore from '../store/usePhotoStore'

export function HomePage() {

    const [searchString, setSearchString] = useState('') //Search string value for controlled search input
    const [startYear, setStartYear] = useState('') //Start year to search
    const [endYear, setEndYear] = useState('') //End year to search
    const [emptyGalleryText, setEmptyGalleryText] = useState('Use the fields above to search for images!')//Empty gallery text, default here, also used for error output
    const luckySearchStrings = usePhotoStore(state => state.luckySearchStrings) //pool of strings to use for the "I'm feeling lucky" button

    const photos = usePhotoStore(state => state.photos) //global photo array
    const setPhotos = usePhotoStore(state => state.setPhotos) //Setter for the photo array

    
    const generateLuck = async () => {
        const randIndex = Math.floor(Math.random() * luckySearchStrings.length) //Generate a random index by getting a random value 0-1, then multiply by the # of available lucky search strings
        const randSearchString = luckySearchStrings[randIndex]
        //console.log(randSearchString)
        setSearchString(randSearchString) //Use that random index to update the search string

        //Then select random year values, ensuring the end year is after the start year so that the search is valid
        const randStartYear = Math.floor(Math.random() * 176) + 1850 //This is the max year, 2026, minus the oldest year in the range, 1850, and then adding that 1850 bottom range so we never get lower than that

        const randEndYear = Math.floor(Math.random() * (2026 - randStartYear)) + randStartYear //This is the max year, 2026, minus start year calculated, + the start year calculated, ensuring our end date is the same or later

        //console.log(randStartYear)
        //console.log(randEndYear)

        setStartYear(randStartYear)
        setEndYear(randEndYear)

        performDynamicSearch(randSearchString, randStartYear, randEndYear) //Finally, perform the search using the values we generated
    }
    
    //Async method to fetch the images based on the search string and start/end values specified
    const performDynamicSearch = async (searchText = "", startYear = "", endYear = "") => {
        try {

            const searchParams = new URLSearchParams( {q: searchText } ) //Convert the search text string into a URL query string

            if(startYear != "")
            {
                searchParams.append("year_start", startYear) //If we have a start date defined, submit it
            }

            if(endYear != "")
            {
                searchParams.append("year_end", endYear) //If we have an end date defined, submit it
            }

            //Fetch request
            const response = await fetch(`/nasa-api/search?media_type=image&${searchParams.toString()}`, {
                method: 'GET',
                headers: {'api_key': '9Zmulnpo0n3i9KmIqaRBLoOzomc8Sl6mYJuYKqa0', 'accept': '/*'}
            })

            //Thorw error here if our response isn't okay
            if(!response.ok)
            {
                //console.log("Throwing error")
                throw new Error(`API Response Not Okay! Status Code: ${response.status} - ${response.statusText}`)
            }

            const imgData = await response.json()
            
            //console.log(imgData)

            /*Trying to break down responsee into just the image link we need, and the info to display it, i.e. width, height
              *added the filter that Claude recommended, just in case any of the API results don't have image links, we don't want to try reading/rendering them.*/

        
            const imageLinks = imgData.collection.items.filter(item => item.links && item.links.length > 0).map(item => ({
                title: item.data[0].title,
                src: item.links[0].href,
                width: item.links[0].width,
                height: item.links[0].height
            }))

            //console.log("Parsed info: ")
            //console.log(imageLinks)
            //console.log("--------")

            if(imageLinks.length === 0)
            {
                setEmptyGalleryText("No images found for the specified search criteria.")
            }

            setPhotos(imageLinks)

        }
        catch(error)
        {
            setEmptyGalleryText(error.message)
        }
    }

    const handleSearch = () => {
        performDynamicSearch(searchString, startYear, endYear)
    }

  return (
    <div>
        <h1>NASA Image Search</h1>
        <div style={{display: "flex", flexDirection: "row", 'justifyContent': "center", 'paddingBottom': "10px", gap: "10px"}}>
            <label>Search 
                <input type="text" id="search_box" name="search_box" value={searchString}
                    onChange={e => setSearchString(e.target.value)}
                    placeholder="Search..."
                    />
            </label>

            <YearPicker id="startDate" labelText="Start Year " yearValue={startYear} yearSetter={setStartYear}/>
            <YearPicker id="endDate" labelText="End Year " yearValue={endYear} yearSetter={setEndYear}/>
            

            <button onClick={handleSearch}>Search</button>
            <button onClick={generateLuck}>I'm feeling lucky!</button>
        </div>

        {photos.length === 0 ? <span>{emptyGalleryText}</span> : <ImageGallery/>}

    </div>
  )
}

export default HomePage