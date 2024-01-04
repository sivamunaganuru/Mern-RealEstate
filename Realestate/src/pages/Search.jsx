import { set } from 'mongoose';
import React,{useState,useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ListingComponent from '../components/ListingComponent';
const Search = () => {

    const [searchParams, setSearchParams] = useState({ searchTerm : '',
                                                        type : 'all',
                                                        offer : false,
                                                        parking : false,
                                                        furnished : false,
                                                        sort : 'createdAt',
                                                        order : 'desc'
                                                    });

    const [listings, setListings] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showMore, setShowMore] = useState(true);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const term = urlParams.get('searchTerm');
        const type = urlParams.get('type');
        const offer = urlParams.get('offer');
        const parking = urlParams.get('parking');
        const furnished = urlParams.get('furnished');
        const sort = urlParams.get('sort');
        const order = urlParams.get('order');
        // console.log(term,type,offer,parking,furnished,sort,order);
        setSearchParams({...searchParams, searchTerm : term || '',
                                            type : type || 'all',
                                            offer : offer==='true' || offer===true ? true : false,
                                            parking : parking === 'true' || parking === true ? true : false,
                                            furnished : furnished === 'true' || furnished === true ? true : false,
                                            sort : sort || 'createdAt',
                                            order : order || 'desc'
                                        });
        fetchListings();
    },[window.location.search]);
    
    const fetchListings = async (startindex) => {
        try{
            setLoading(true);
            const urlParams = new URLSearchParams(window.location.search);
            console.log(startindex);
            if(startindex){
                urlParams.set('startIndex',startindex);
            }
            axios({
                method : 'GET',
                url : `/api/listing/get-listings?${urlParams.toString()}`,
            }).then(res => {
                console.log(res);
                setListings(res.data.listings);
            }
            ).catch(err => {
                console.log(err);
            })
            setLoading(false);
        }
        catch(err){
            setLoading(false);
            console.log(err);
        }
    }


    const handleChanges = (e) => {
        let key = e.target.id;
        let value;
        if(key === 'offer' || key === 'parking' || key === 'furnished'){
            value = e.target.checked || e.target.checked === 'true' ? true : false;
            setSearchParams({...searchParams, [key] : value});
            
        }
        else if(key === 'all' || key === 'rent' || key === 'sale'){
            setSearchParams({...searchParams, type : key});
        }
        else if(key === 'sort'){
            value = e.target.value.split('_')[0];
            const order = e.target.value.split('_')[1];
            setSearchParams({...searchParams, order, sort : value});
            return;
        }
        else{
            value = e.target.value;
            setSearchParams({...searchParams, [key] : value});
        }
        
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(window.location.search);
        for(let key in searchParams){
            urlParams.set(key, searchParams[key]);
        }
        navigate(`/search?${urlParams.toString()}`);
    }


  return (
    <div className='flex flex-col md:flex-row p-3 md:p-5 gap-5'>
        <div className='p-4 border-b-4 md:border-r-4 md:min-h-screen'>
            <form className='flex flex-col gap-5' onSubmit={handleSubmit}>
                <div className='flex gap-2 items-center justify-start'>
                    <label htmlFor='searchTerm' className='font-semibold whitespace-nowrap'>Search Term :</label>
                    <input type='text' name='searchTerm' id='searchTerm'
                    placeholder='Search ...'
                    value = {searchParams.searchTerm}
                    onChange={handleChanges}
                    className='border border-gray-400 rounded-lg p-1' />
                </div>
                <div className='flex gap-4 items-center flex-wrap'>
                    <label className='font-semibold whitespace-nowrap'>Type :</label>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='all' className='w-5'
                        checked={searchParams.type == "all"} onChange={handleChanges}/>
                        <label htmlFor='all' className='font-medium' >Rent & Sale</label>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='rent' className='w-5'
                        checked={searchParams.type === "rent"} onChange={handleChanges}/>
                        <label htmlFor='rent' className='font-medium'>Rent</label>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='sale' className='w-5'
                        checked={searchParams.type === "sale"} onChange={handleChanges}/>
                        <label htmlFor='sale' className='font-medium'>Sale</label>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='offer' className='w-5'
                        checked={searchParams.offer} onChange={handleChanges}/>
                        <label htmlFor='offer' className='font-medium'>Offer</label>
                    </div>
                </div>

                <div className='flex gap-4 items-center flex-wrap'>
                    <label className='font-semibold whitespace-nowrap'>Amenities :</label>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='parking' className='w-5'
                        checked={searchParams.parking} onChange={handleChanges}/>
                        <label htmlFor='parking' className='font-medium'>Parking</label>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='furnished' className='w-5'
                        checked={searchParams.furnished} onChange={handleChanges}/>
                        <label htmlFor='furnished' className='font-medium'>Furnished</label>
                    </div>
                </div>

                <div className='flex gap-4 items-center'>
                    <label className='font-semibold whitespace-nowrap'>Sort :</label>
                    <select name='sort' id='sort' className='border border-gray-400 rounded-lg p-1'
                    onChange={handleChanges} defaultValue={'createdAt_desc'}>
                        <option value='regularPrice_desc'>Price : Low to High</option>
                        <option value='regularPrice_asc'>Price : High to Low</option>
                        <option value='createdAt_desc'>Newest</option>
                        <option value='createdAt_asc'>Oldest</option>
                    </select>
                </div>

                <button className='p-3 bg-slate-700 text-white rounded-lg uppercase
                hover:opacity-75' disabled={loading}>Search</button>
            </form>
        </div>
        <div className='flex flex-col gap-2 w-full '>
            <h1 className='font-semibold text-3xl border-b text-slate-700 p-3'>Listing Results :</h1>
            <div className='flex flex-wrap gap-2 w-full pt-3'>
                {!loading && listings.length === 0 &&
                 <h1 className='font-semibold text-2xl text-slate-700 p-3'>No Listings Found</h1>}
                {loading && <h1 className='font-semibold text-2xl text-slate-700 p-3'>Loading...</h1>}
                {!loading && listings.length > 0 && listings.map(listing => (
                    <ListingComponent listing={listing} key={listing._id} />
                ))}
            </div>
            <div className='flex justify-center items-center gap-3'>
                {showMore && listings.length > 0 && <button className='p-3 bg-slate-700 text-white rounded-lg uppercase
                hover:opacity-75' onClick={()=>fetchListings(listings.length)}>Show More</button>}
                {/* {listings.length > 0 && <button className='p-3 bg-slate-700 text-white rounded-lg uppercase
                hover:opacity-75' onClick={()=>setShowMore(!showMore)}>{showMore ? 'Show Less' : 'Show More'}</button>} */}
            </div>
        </div>
    </div>
  )
}

export default Search