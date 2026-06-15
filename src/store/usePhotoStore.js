import { create } from 'zustand'

//Global store for photo search results so they don't ahve to be passed through components
const usePhotoStore = create((set) => ({
    photos: [],
    luckySearchStrings: ["star", "rocket", "moon", "apollo", "galaxy", "andromeda", "asteroid"],

    setPhotos: (photos) => set({photos}),
    setLuckySearchStrings: (luckySearchStrings) => set(luckySearchStrings)
}))

export default usePhotoStore