'use client'


import { useGlobalState } from '@/app/context/globalProvider';
import Image from 'next/image'
import React, { useState, useRef } from 'react'
import Carousel from '../Carousel/Carousel';
import { KeenSliderOptions, useKeenSlider } from "keen-slider/react"
import 'keen-slider/keen-slider.min.css'
import { useInView } from 'react-intersection-observer';
import anime from "animejs/lib/anime.es.js";
import { arrowLeft, arrowRight, plane } from '@/app/utils/Icons';
import Link from 'next/link';

interface Destinations {
    id: string;
    name: string;
    imageURL: string;
}


function DestinationsPage() {
    const { Eurodestinations, Randomdestinations, isLoadingEuro, isLoadingRandom } = useGlobalState();
    const [loaded, setLoaded] = useState(false);
    const ksOptions: KeenSliderOptions = {
        initial: 0,
        loop: true,
        mode: "free-snap",
        slides: {
            perView: 4,
            spacing: 15,
        },
        created() {
            setLoaded(true);
        },
    }
    const [sliderRef, instanceRef] = useKeenSlider(ksOptions);

    React.useEffect(() => {
        instanceRef.current?.update(ksOptions);
    }, [Eurodestinations]);

    const textRefs = useRef(Array.from({ length: 2 }).map(() => useRef(null)));
    const [triggered, setTriggered] = useState(Array.from({ length: 2 }).fill(false));

    const animateText = (index: any) => {
        anime({
            targets: textRefs.current[index].current,
            translateY: [100, 0],
            opacity: [0, 1],
            easing: "easeOutExpo",
            duration: 1200,
            delay: 200
        });
    };

    const [ref1, inView1] = useInView({
        triggerOnce: true,
        threshold: 0.5
    });

    const [ref2, inView2] = useInView({
        triggerOnce: true,
        threshold: 0.5
    });


    React.useEffect(() => {
        if (inView1 && !triggered[0]) {
            animateText(0);
            setTriggered((prev) => [...prev.slice(0, 0), true, ...prev.slice(0)]);
        }
    }, [inView1, triggered]);

    React.useEffect(() => {
        if (inView2 && !triggered[1]) {
            animateText(1);
            setTriggered((prev) => [...prev.slice(0, 1), true, ...prev.slice(1)]);
        }
    }, [inView2, triggered]);

    return (
        <div className='h-full caret-transparent'>

            <div ref={ref1} className='bg-base-200 px-16 py-12 m-16 rounded-badge drop-shadow-lg'>
                <div ref={textRefs.current[0]} className='flex flex-row justify-between items-center opacity-0'>
                    <div>
                        <div className='flex flex-row items-center'>
                            <span className='btn btn-sm btn-info rounded-full text-white no-animation mr-5 hover:bg-info cursor-default'>{plane}</span>
                            <h1 className='text-3xl font-bold text-start text-sky-400'>
                                Khám phá các địa điểm nổi bật tại châu Âu
                            </h1>
                        </div>
                        <p className='mt-5 pr-20 text-justify'>
                            Trải nghiệm hấp dẫn tại các điểm đến đặc sắc ở châu Âu, khám phá văn hóa, phong cảnh và ẩm thực độc đáo trên toàn lục địa này.
                        </p>
                    </div>
                    <Image
                        width={500}
                        height={100}
                        src={'/home/landscape2.png'}
                        alt={'landscape2'} />
                </div>
                {isLoadingEuro ? (
                    <div ref={sliderRef} className="keen-slider mt-8">
                        <div className='keen-slider__slide number-slide1 skeleton w-32 h-52'></div>
                        <div className='keen-slider__slide number-slide2 skeleton w-32 h-52 ml-5'></div>
                        <div className='keen-slider__slide number-slide3 skeleton w-32 h-52 ml-5'></div>
                        <div className='keen-slider__slide number-slide4 skeleton w-32 h-52 ml-5'></div>
                    </div>
                ) : (
                    <div ref={sliderRef} className="keen-slider mt-8">
                        {Eurodestinations.map((euro: Destinations, index: number) => (
                            <div key={index} className={`keen-slider__slide number-slide${index + 1}`}>
                                <Carousel
                                    key={euro.id}
                                    id={euro.id}
                                    name={euro.name}
                                    imageURL={euro.imageURL}
                                />
                            </div>
                        ))}
                        {loaded && instanceRef.current && (
                            <>
                                <button
                                    onClick={(e: any) =>
                                        instanceRef.current?.prev()
                                    }
                                    className='join-item btn btn-base-200 absolute top-[5.2rem] z-10 left-2'>
                                    {arrowLeft}
                                </button>
                                <button
                                    onClick={(e: any) =>
                                        instanceRef.current?.next()
                                    }
                                    className='join-item btn btn-base-200 absolute top-[5.2rem] z-10 right-2'>
                                    {arrowRight}
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>

            <div ref={ref2} className='bg-base-200 p-16 m-16 rounded-badge drop-shadow-lg'>
                <div className='flex flex-row justify-between items-center'>
                    <div ref={textRefs.current[1]} className=' w-2/3 opacity-0'>
                        <div className='flex flex-row items-center'>
                            <span className='btn btn-sm btn-info rounded-full text-white no-animation mr-5 hover:bg-info cursor-default'>{plane}</span>
                            <h1 className='text-3xl font-bold text-start text-sky-400'>
                                Một vài địa điểm khác bạn có thể thích
                            </h1>
                        </div>
                        <p className='mt-5 pr-40 text-justify'>
                            Khám phá những điểm đến độc đáo, từ bờ biển tới ngọn núi, mang đến trải nghiệm du lịch đa dạng và thú vị cho mọi người.
                        </p>
                    </div>
                </div>
                {isLoadingRandom ? (
                    < div className="grid grid-cols-3 gap-4 mt-8">
                        <div className="skeleton w-full h-52"></div>
                        <div className="skeleton w-full h-52"></div>
                        <div className="skeleton w-full h-52"></div>
                        <div className="skeleton w-full h-52"></div>
                        <div className="skeleton w-full h-52"></div>
                        <div className="skeleton w-full h-52"></div>
                    </div>
                ) : (
                    < div className="grid grid-cols-3 gap-4 mt-8">
                        {Randomdestinations.map((random: Destinations) => (
                            <Link href={'/destinations/' + random.id} key={random.id} className="relative hover:bg-black duration-300 hover:rounded-lg">
                                <img src={random.imageURL} alt={random.name} className="w-full h-52 object-cover rounded-lg transition  hover:opacity-70" />
                                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white px-4 py-2 rounded-b-lg">
                                    <p className="text-xl font-semibold">{random.name}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div >
    )
}

export default DestinationsPage