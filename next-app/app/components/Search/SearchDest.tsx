import React, { useState, useEffect } from 'react';
import { useGlobalState } from '@/app/context/globalProvider';
import 'keen-slider/keen-slider.min.css'
import Carousel from '../Carousel/Carousel';
import { KeenSliderOptions, useKeenSlider } from 'keen-slider/react';
import { arrowLeft, arrowRight, poll } from '@/app/utils/Icons';

interface Destinations {
    id: string;
    name: string;
    imageURL: string;
}

function SearchDest() {
    const { Searchdestinations, isLoadingSearch } = useGlobalState();
    const [loaded, setLoaded] = useState(false);
    const [noResults, setNoResults] = useState(false);
    const ksOptions: KeenSliderOptions = {
        initial: 0,
        loop: true,
        mode: 'free-snap',
        slides: {
            perView: 3,
            spacing: 15,
        },
        created() {
            setLoaded(true);
        },
    };
    const [sliderRef, instanceRef] = useKeenSlider(ksOptions);


    useEffect(() => {
        instanceRef.current?.update(ksOptions);
        if (Searchdestinations.length === 0 && !isLoadingSearch) {
            setNoResults(true);
        } else {
            setNoResults(false);
        }
    }, [Searchdestinations, isLoadingSearch]);

    return (
        <div className='bg-base-200 px-16 py-12 my-16 mx-36 rounded-badge drop-shadow-lg'>
            <div className='flex flex-row justify-between items-center'>
                <div>
                    <div className='flex flex-row items-center'>
                        <span className='btn btn-sm btn-info rounded-full text-white no-animation mr-5 hover:bg-info cursor-default'>{poll}</span>
                        <h1 className='text-3xl font-bold text-start text-sky-400'>
                            Kết quả tìm kiếm:
                        </h1>
                    </div>
                </div>
            </div>
            {noResults ? (
                <p className="text-red-500 text-2xl mt-8">Không tìm thấy khách sạn!</p>
            ) : isLoadingSearch ? (
                <div ref={sliderRef} className="keen-slider mt-8">
                    <div className='keen-slider__slide number-slide1 skeleton w-32 h-52'></div>
                    <div className='keen-slider__slide number-slide2 skeleton w-32 h-52'></div>
                    <div className='keen-slider__slide number-slide3 skeleton w-32 h-52'></div>
                    <div className='keen-slider__slide number-slide4 skeleton w-32 h-52'></div>
                </div>
            ) : (
                <div ref={sliderRef} className='keen-slider mt-8 flex flex-row relative overflow-hidden'>
                    {Searchdestinations.map((search: Destinations, index: number) => (
                        <div key={index} className={`keen-slider__slide number-slide${index + 1}`}>
                            <Carousel
                                key={search.id}
                                id={search.id}
                                name={search.name}
                                imageURL={search.imageURL}
                            />
                        </div>
                    ))}
                    {loaded && instanceRef.current && (
                        <>
                            <button
                                onClick={(e: any) => instanceRef.current?.prev()}
                                className='join-item btn btn-base-200 absolute top-[5.2rem] z-10 left-2'>
                                {arrowLeft}
                            </button>
                            <button
                                onClick={(e: any) => instanceRef.current?.next()}
                                className='join-item btn btn-base-200 absolute top-[5.2rem] z-10 right-2'>
                                {arrowRight}
                            </button>
                        </>
                    )}
                </div>
            )
            }
        </div>
    );
}

export default SearchDest;
