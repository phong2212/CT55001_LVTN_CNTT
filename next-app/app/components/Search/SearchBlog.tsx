import React, { useState, useEffect } from 'react';
import { useGlobalState } from '@/app/context/globalProvider';
import 'keen-slider/keen-slider.min.css'
import { KeenSliderOptions, useKeenSlider } from 'keen-slider/react';
import { arrowLeft, arrowRight, poll } from '@/app/utils/Icons';
import Card from '../Card/Card';

interface Blogs {
    id: string;
    authorId: string;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    imageURL: string;
}

interface Users {
    id: string;
    clerkId: string;
    firstName: string;
    lastName: string;
}

function SearchBlog() {
    const { users, SearchBlogs, isLoadingSearchBlog } = useGlobalState();
    const [loaded, setLoaded] = useState(false);
    const [noResults, setNoResults] = useState(false);
    const ksOptions: KeenSliderOptions = {
        initial: 0,
        loop: true,
        mode: 'free-snap',
        slides: {
            perView: 4,
            spacing: 15,
        },
        created() {
            setLoaded(true);
        },
    };
    const [sliderRef, instanceRef] = useKeenSlider(ksOptions);


    useEffect(() => {
        instanceRef.current?.update(ksOptions);
        if (SearchBlogs.length === 0 && !isLoadingSearchBlog) {
            setNoResults(true);
        } else {
            setNoResults(false);
        }
    }, [SearchBlogs, isLoadingSearchBlog]);

    return (
        <div className='bg-base-200 px-16 py-12 m-16 rounded-badge drop-shadow-lg'>
            <div className='flex flex-row justify-between items-center'>
                <div className='w-2/3'>
                    <div className='flex flex-row items-center'>
                        <span className='btn btn-sm btn-info rounded-full text-white no-animation mr-5 hover:bg-info cursor-default'>{poll}</span>
                        <h1 className='text-3xl font-bold text-start text-sky-400'>
                            Kết quả tìm kiếm:
                        </h1>
                    </div>
                </div>
            </div>
            {noResults ? (
                <p className="text-red-500 text-2xl mt-8">Không tìm thấy blog!</p>
            ) : isLoadingSearchBlog ? (
                <div className="keen-slider mt-8">
                    <div className='keen-slider__slide number-slide1 skeleton w-32 h-96'></div>
                    <div className='keen-slider__slide number-slide2 skeleton w-32 h-96 ml-5'></div>
                    <div className='keen-slider__slide number-slide3 skeleton w-32 h-96 ml-5'></div>
                    <div className='keen-slider__slide number-slide4 skeleton w-32 h-96 ml-5'></div>
                </div>
            ) : (
                <div ref={sliderRef} className="keen-slider mt-8">
                    {SearchBlogs.map((search: Blogs, index: number) => {
                        const authorUser = users.find((user: Users) => user.clerkId === search.authorId);
                        return (
                            <div key={index} className={`keen-slider__slide number-slide${index + 1}`}>
                                <Card
                                    key={search.id}
                                    id={search.id}
                                    author={authorUser ? `${authorUser.firstName} ${authorUser.lastName}` : 'Unknown'}
                                    title={search.title}
                                    content={search.content}
                                    createdAt={search.createdAt}
                                    imageURL={search.imageURL}
                                />
                            </div>

                        );
                    })}
                    {loaded && instanceRef.current && (
                        <>
                            <button
                                onClick={(e: any) =>
                                    instanceRef.current?.prev()
                                }
                                className='join-item btn btn-base-200 absolute top-40 z-10 left-2'>
                                {arrowLeft}
                            </button>
                            <button
                                onClick={(e: any) =>
                                    instanceRef.current?.next()
                                }
                                className='join-item btn btn-base-200 absolute top-40 z-10 right-2'>
                                {arrowRight}
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default SearchBlog;
