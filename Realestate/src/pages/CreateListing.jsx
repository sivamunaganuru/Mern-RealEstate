import React from 'react'
import { useState,useEffect } from 'react';
import app from '../firebase';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useSelector,useDispatch } from 'react-redux'
import { fileUploading,fileUploadFailure,fileUploadSuccess,clearOldMessages } from '../redux/userSlice';
import useErrorToastify from '../customHooks/errorToastify.js';
import useSuccessToastify from '../customHooks/successToastify.js';
import { set } from 'mongoose';

const CreateListing = () => {

    const [images, setImages] = useState([]);
    const [form, setForm] = useState({
        name    : '',
        description   : '',
        address  : '',
        regularPrice : 0,
        discountedPrice : 0,
        bedrooms : 0,
        bathrooms: 0,
        furnished : false,
        parking : false,
        sell : false,
        rent : false,
        offer :false,
        imageUrls : []
    });
    const {filesuploading,apierror} = useSelector(state => state.user);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(clearOldMessages());
    },[]);
    useErrorToastify();
    useSuccessToastify();

    const handleImageChange = (e) => {
        const files = e.target.files;
        setImages(files);
    }


    const handleFormChange = (e) => {
        const key = e.target.id;
        let value;
        if (key == "furnished" || key == "parking" || key == "offer" || key == "sell" || key == "rent") {
            value = e.target.checked;
        }
        else if (key == "bedrooms" || key == "bathrooms" || key == "regularPrice" || key == "discountedPrice") {
            value = parseInt(e.target.value);
        }
        else{
            value = e.target.value;
        }
        const updatedForm = { ...form, [key]: value };
        setForm(updatedForm);
    }

    const handleImageupload = function async (e) {
        e.preventDefault();
        if (images.length == 0) {
            alert("No images selected");
            return;
        }
        const storage = getStorage(app);
        const storageRef = ref(storage, 'images');
        console.log(images)
        dispatch(fileUploading());
        try{
            for (const image of images) {
                const fileName = new Date().getTime()+ "-" + image.name;
                const imageRef = ref(storageRef, fileName);
                const uploadTask = uploadBytesResumable(imageRef, image);
                uploadTask.on('state_changed',
                    (snapshot) => {
                        // progress function
                    },
                    (error) => {
                        console.log(error);
                        dispatch(fileUploadFailure(error.message));
                    },
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            console.log('File available at', downloadURL);
                            const updatedForm = { ...form };
                            updatedForm.imageUrls.push(downloadURL);
                            setForm(updatedForm);
                        });
                    }
                );
            }
            dispatch(fileUploadSuccess());
            
        }
        catch(error){
            dispatch(fileUploadFailure(error.message));
        }
        setImages([]);
    }

    const handleDeleteimage = (index) => {
        const updatedForm = { ...form };
        updatedForm.imageUrls.splice(index, 1);
        setForm(updatedForm);
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        
    }


    return (
    <main className='p-3 max-w-4xl mx-auto'>
        <h1 className='text-3xl text-gray-950 text-center my-4 font-semibold'>Create Listing</h1>

        <form className='flex flex-col sm:flex-row gap-6 sm:gap-10'>

            <div className='flex flex-col flex-1'>
                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Name
                    </label>
                    <input 
                        id='name' 
                        className='border border-gray-400 p-2 rounded-lg w-full max-w-md'
                        type='text' 
                        placeholder='name' 
                        value={form.name} 
                        onChange={handleFormChange}
                        required
                        minLength={6}
                        maxLength={50}
                    />
                    {/* <p className='text-red-500 text-sm'>{errors.username}</p> */}
                </div>

                <div className="mb-4">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                    </label>
                    <textarea
                        id='description' 
                        className='border border-gray-400 p-2 rounded-lg  w-full max-w-md overflow-y-auto placeholder:font-normal'
                        type='text' 
                        placeholder='description' 
                        value={form.description} 
                        onChange={handleFormChange}
                        required
                    />
                    {/* <p className='text-red-500 text-sm'>{errors.email}</p> */}
                </div>

                <div className="mb-4">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                        Address
                    </label>
                    <input 
                        id='address' 
                        className='border border-gray-400 p-2 rounded-lg  w-full max-w-md'
                        type='text' 
                        placeholder='address' 
                        value={form.address} 
                        onChange={handleFormChange}
                        required
                        minLength={1}
                    />
                    {/* <p className='text-red-500 text-sm'>{errors.password}</p> */}
                </div>

                <div className="mb-4 flex flex-wrap gap-4 w-full max-w-md">
                    <div className="flex gap-2">
                        <input type='checkbox' id='furnished' value={form.furnished} onChange={handleFormChange} />
                        <label htmlFor="furnished" className=" text-sm font-medium text-gray-700"> Furnished</label>
                    </div>
                    <div className="flex gap-2">
                        <input type='checkbox' id='parking' value={form.parking} onChange={handleFormChange} />
                        <label htmlFor="parking" className="text-sm font-medium text-gray-700"> Parking</label>
                    </div>
                    <div className="flex gap-2">
                        <input type='checkbox' id='offer' value={form.offer} onChange={handleFormChange} />
                        <label htmlFor="offer" className="text-sm font-medium text-gray-700"> Offer</label>
                    </div>
                    <div className="flex gap-2">
                        <input type='checkbox' id='sell' value={form.sell} onChange={handleFormChange} />
                        <label htmlFor="sell" className="text-sm font-medium text-gray-700"> Sell</label>
                    </div>
                    <div className="flex gap-2">
                        <input type='checkbox' id='rent' value={form.rent} onChange={handleFormChange} />
                        <label htmlFor="rent" className="text-sm font-medium text-gray-700"> Rent</label>
                    </div>                    
                </div>

                <div className="mb-4 flex flex-wrap gap-4 w-full max-w-md">
                    <div className="flex gap-2 items-center">
                        <input 
                            id='bedrooms' 
                            className='p-2 border border-gray-400 rounded-lg'
                            type='number' 
                            placeholder="0" 
                            value={form.bedrooms} 
                            onChange={handleFormChange}
                            required
                            min="0"
                            max = "10"
                        />
                        <label htmlFor="bedrooms" className="text-sm font-medium text-gray-700 mb-1">
                            Beds
                        </label>
                    </div>
                    <div className="flex gap-2 items-center">
                        <input 
                            id='bathrooms' 
                            className='p-2 border border-gray-400 rounded-lg'
                            type='number' 
                            placeholder="0" 
                            value={form.bathrooms} 
                            onChange={handleFormChange}
                            required
                            min="0"
                            max="10"
                        />
                        <label htmlFor="bathrooms" className="text-sm font-medium text-gray-700 mb-1">
                            Baths
                        </label>
                    </div>  
                    <div className="flex gap-2 items-center">
                    <input 
                        id='regularPrice' 
                        className='p-2 border border-gray-400 rounded-lg'
                        type='number' 
                        placeholder="0" 
                        value={form.regularPrice} 
                        onChange={handleFormChange}
                        required
                        min={0}
                    />
                    <label htmlFor="regularPrice" className="text-sm font-medium text-gray-700 mb-1">
                        Regular Price {form.sell!=true && <span>($/Month)</span>}
                    </label>
                    </div>    
                    
                    <div className="flex gap-2 items-center">
                    <input 
                        id='discountedPrice' 
                        className='p-2 border border-gray-400 rounded-lg'
                        type='number' 
                        placeholder="0" 
                        value={form.discountedPrice} 
                        onChange={handleFormChange}
                        required
                        min={0}
                    />
                    <label htmlFor="discoutedPrice" className="text-sm font-medium text-gray-700 mb-1">
                        Discounted Price {form.sell!=true && <span>($/Month)</span>}
                    </label>
                    </div>                 
                </div>
                
            </div>

            <div className='flex flex-col flex-1 gap-6'>
                <div className='flex flex-col gap-4 '>
                    <p className='text-gray-600'><span className='font-semibold text-black mr-2'>Images:</span>
                    The first image will be the cover (max 6)</p>
                    <div className='flex gap-3'>
                        <input type = "file" id="imageUrls" name="imageUrls" multiple
                            accept="image/*" onChange={handleImageChange}
                            className="border border-gray-400 p-2 rounded w-full max-w-xs"/>
                        <button className='border border-green-700 text-green-700 p-3 rounded-sm
                        hover:shadow-lg disabled:opacity-70' onClick={handleImageupload} disabled={filesuploading}>
                        {filesuploading? "...Uploading" : "Upload" }</button>
                    </div>
                    {form.imageUrls.length>0 &&(<div className='flex flex-col gap-2 max-h-80 overflow-y-auto'>{
                        form.imageUrls.map((url,index) => (
                        <div className='flex justify-between p-3 items-center border border-gray-200' key={index}>
                            <img src={url} alt='image' className='w-20 h-20 object-contain rounded-lg'/>
                            <button className=' text-red-700 underline p-3 rounded-lg uppercase hover:opacity-75'
                            onClick={()=>handleDeleteimage(index)}>
                                Delete
                            </button>
                            </div>)
                    )}
                    </div>
                    )}
                </div>
                <button className="border border-gray-400 p-3 rounded-lg 
                    uppercase bg-slate-700 text-white w-full max-w-md mx-auto
                    hover:opacity-85 disabled:opacity-70" onClick={handleSubmit}
                    disabled={filesuploading}>Create listing</button>
            </div>
            
        </form>    

    </main>
  )
}

export default CreateListing