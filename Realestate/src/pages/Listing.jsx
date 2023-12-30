import React from 'react'
import { useState,useEffect } from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { fileUploading,fileUploadFailure,fileUploadSuccess,clearOldMessages } from '../redux/userSlice';
import useErrorToastify from '../customHooks/errorToastify.js';
import useSuccessToastify from '../customHooks/successToastify.js';
import axios from 'axios';
import Spinner from '../components/Spinner.jsx';
import { useNavigate,useParams } from 'react-router-dom';
import {Swiper,SwiperSlide} from 'swiper/react';
import SwiperCore from 'swiper';
import {Navigation} from "swiper/modules"
import "swiper/css/bundle";
import {
    FaBath,
    FaBed,
    FaChair,
    FaMapMarkedAlt,
    FaMapMarkerAlt,
    FaParking,
    FaShare,
  } from 'react-icons/fa';
import Contact from '../components/Contact.jsx';

const Listing = () => {
    const [listing, setListing] = useState({
        name    : '',
        description   : '',
        address  : '',
        regularPrice : 50,
        discountedPrice : 0,
        bedrooms : 1,
        bathrooms: 1,
        furnished : false,
        parking : false,
        sell : false,
        rent : true,
        offer :false,
        imageUrls : [],
        userRef : ''
    });
    const {filesuploading,apierror,currentUser} = useSelector(state => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();
    SwiperCore.use([Navigation]);
    const [showContact, setShowContact] = useState(false);

    useEffect(() => {
        dispatch(clearOldMessages());
        const listingId = params.id;
        const fetchingListing = async () => {
            try{
                const res = await axios.get(`/api/listing/get/${listingId}`);
                console.log(res);
                const listing = res.data.listing;
                setListing({
                    name    : listing.name,
                    description   : listing.description,
                    address  : listing.address,
                    regularPrice : listing.regularPrice,
                    discountedPrice : listing.discountedPrice,
                    bedrooms : listing.bedrooms,
                    bathrooms: listing.bathrooms,
                    furnished : listing.furnished,
                    parking : listing.parking,
                    sell : listing.type == "sell" ? true : false,
                    rent : listing.type == "rent" ? true : false,
                    offer : listing.offer,
                    imageUrls : listing.imageUrls,
                    userRef : listing.userRef
                });
            }
            catch(error){
                console.log(error.response);
                dispatch(fileUploadFailure(error.response || 'Unable to fetch listing,Try Again'));
            }
        }
        fetchingListing();
    },[]);
    useErrorToastify();
    useSuccessToastify();

  return (
    <main >
        <Swiper navigation={true}>
            {listing.imageUrls.map((url,index) => {
                return (
                    <SwiperSlide key={index}>
                        <div className="w-full h-96 bg-cover bg-center" style={{backgroundImage : `url(${url})`}}></div>
                    </SwiperSlide>
                )
            })}
        </Swiper>
        <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'>
            <p className='text-2xl font-semibold'>
              {listing.name} - ${' '}
              {listing.offer
                ? listing.discountedPrice
                : listing.regularPrice}
              {listing.type === 'rent' && ' / month'}
            </p>
            <p className='flex items-center mt-6 gap-2 text-slate-600  text-sm'>
              <FaMapMarkerAlt className='text-green-700' />
              {listing.address}
            </p>
            <div className='flex gap-4'>
              <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
              </p>
              {listing.offer && (
                <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                  ${+listing.regularPrice - +listing.discountedPrice} OFF
                </p>
              )}
            </div>
            <p className='text-slate-800'>
              <span className='font-semibold text-black'>Description - </span>
              {listing.description}
            </p>
            <ul className='text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBed className='text-lg' />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} beds `
                  : `${listing.bedrooms} bed `}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBath className='text-lg' />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} baths `
                  : `${listing.bathrooms} bath `}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaParking className='text-lg' />
                {listing.parking ? 'Parking spot' : 'No Parking'}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaChair className='text-lg' />
                {listing.furnished ? 'Furnished' : 'Unfurnished'}
              </li>
            </ul>
            {currentUser && currentUser._id === listing.userRef && !showContact && (
            <button className='border p-3 bg-slate-700 text-white rounded-lg uppercase
            hover:opacity-70' onClick={()=>setShowContact(!showContact)}>Contact Landlord</button>
            )}
            {showContact && <Contact listing={listing} />}
        </div>
    </main>
  )
}

export default Listing