import React from 'react'
import { useState,useEffect } from 'react';
const CreateListing = () => {

    const [form, setForm] = useState({
        title    : '',
        description   : '',
        address  : '',
        regularPrice : 0,
        discountedPrice : 0,
        bedrooms : 0,
        bathrooms: 0,
        furnished : false,
        parking : false,
        type : '',
        offer :false,
        imageUrls : []
    });

    const handleFormChange = (e) => {
        const key = e.target.id;
        const value = e.target.value;
        const updatedForm = { ...form, [key]: value };
        setForm(updatedForm);
    }


    return (
    <main className='p-3 max-w-4xl mx-auto'>
        <h1 className='text-3xl text-gray-950 text-center my-4 font-semibold'>Create Listing</h1>

        <form className='flex flex-col sm:flex-row gap-6'>

            <div className='flex flex-col flex-1'>
                <div className="mb-4">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Title
                    </label>
                    <input 
                        id='title' 
                        className='border border-gray-400 p-2 rounded-lg w-full max-w-md'
                        type='text' 
                        placeholder='Title' 
                        value={form.title} 
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
                        <label htmlFor="furnished" className="block text-sm font-medium text-gray-700"> Furnished</label>
                    </div>
                    <div className="flex gap-2">
                        <input type='checkbox' id='parking' value={form.parking} onChange={handleFormChange} />
                        <label htmlFor="parking" className="block text-sm font-medium text-gray-700"> Parking</label>
                    </div>
                    <div className="flex gap-2">
                        <input type='checkbox' id='offer' value={form.offer} onChange={handleFormChange} />
                        <label htmlFor="offer" className="block text-sm font-medium text-gray-700"> Offer</label>
                    </div>
                    <div className="flex gap-2">
                        <input type='checkbox' id='sell' value={form.sell} onChange={handleFormChange} />
                        <label htmlFor="sell" className="block text-sm font-medium text-gray-700"> Sell</label>
                    </div>
                    <div className="flex gap-2">
                        <input type='checkbox' id='rent' value={form.rent} onChange={handleFormChange} />
                        <label htmlFor="rent" className="block text-sm font-medium text-gray-700"> Rent</label>
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
                        <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-1">
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
                        <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-1">
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
                    <label htmlFor="regularPrice" className="block text-sm font-medium text-gray-700 mb-1">
                        Regular Price {form.type!="sell" && <span>($/Month)</span>}
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
                    <label htmlFor="discoutedPrice" className="block text-sm font-medium text-gray-700 mb-1">
                        Discounted Price {form.type!="sell" && <span>($/Month)</span>}
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
                            accept="image/*" onChange={handleFormChange}
                            className="border border-gray-400 p-2 rounded w-full max-w-xs"/>
                        <button className='border border-green-700 text-green-700 p-3 rounded-sm
                        hover:shadow-lg disabled:opacity-70'>Upload</button>
                    </div>
                </div>
                <button className="border border-gray-400 p-3 rounded-lg 
                    uppercase bg-slate-700 text-white w-full max-w-md mx-auto
                    hover:opacity-85 disabled:opacity-70">Create listing</button>
            </div>
            
        </form>    

    </main>
  )
}

export default CreateListing