import Link from 'next/link';
import React, { useState } from 'react'

interface Props {
    id: string;
    author: string;
    title: string;
    content: string;
    createdAt: Date;
    imageURL: string;
}

function Card({ id, author, title, content, imageURL, createdAt }: Props) {
    const [timeAgo, setTimeAgo] = useState('');

    React.useEffect(() => {
        const calculateTimeAgo = () => {
            const now = new Date().getTime();
            const formattedCreatedAt = new Date(createdAt).getTime();
            const interval = Math.floor((now - formattedCreatedAt) / 1000);

            let timeAgoStr = '';

            if (interval >= 31536000) {
                const years = Math.floor(interval / 31536000);
                timeAgoStr = `${years} năm trước`;
            } else if (interval >= 2592000) {
                const months = Math.floor(interval / 2592000);
                timeAgoStr = `${months} tháng trước`;
            } else if (interval >= 86400) {
                const days = Math.floor(interval / 86400);
                timeAgoStr = `${days} ngày trước`;
            } else if (interval >= 3600) {
                const hours = Math.floor(interval / 3600);
                timeAgoStr = `${hours} giờ trước`;
            } else if (interval >= 60) {
                const minutes = Math.floor(interval / 60);
                timeAgoStr = `${minutes} phút trước`;
            } else {
                timeAgoStr = 'Vừa xong';
            }

            setTimeAgo(timeAgoStr);
        };

        calculateTimeAgo();

        const intervalId = setInterval(calculateTimeAgo, 60000);

        return () => clearInterval(intervalId);
    }, [createdAt]);

    const contentRef = React.useRef<HTMLParagraphElement>(null);


    React.useEffect(() => {
        const truncateContent = () => {
            if (!contentRef.current) return;

            const contentHeight = contentRef.current.clientHeight;

            if (contentHeight > 3 * 20) {
                contentRef.current.style.overflow = 'hidden';
                contentRef.current.style.display = '-webkit-box';
                contentRef.current.style.webkitLineClamp = '3';
                contentRef.current.style.webkitBoxOrient = 'vertical';
            }
        };

        truncateContent();
    }, []);

    const contentWithoutTags = content.replace(/<[^>]+>/g, '');

    return (
        <div className="bg-base-100 shadow-md rounded-lg overflow-hidden">
            <Link href={"/blogs/" + id} >
                <div className="relative h-56">
                    <img className="absolute h-full w-full object-fill drop-shadow-md rounded-lg" src={imageURL} alt="Blog Image" />
                </div>
                <div className="px-6 py-3">
                    <p className="font-bold text-md h-12 flex items-center">{title}</p>
                    <p ref={contentRef} className="text-gray-700 text-sm my-2 text-justify  h-[3.8rem]">{contentWithoutTags}</p>
                    <p className="text-gray-700 text-xs">{author}</p>
                    <p className="text-gray-700 text-xs">{timeAgo}</p>
                </div>
            </Link>
        </div>
    )
}

export default Card