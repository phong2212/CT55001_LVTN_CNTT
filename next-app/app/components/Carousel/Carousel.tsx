import Link from "next/link";

interface Props {
    id: string;
    name: string;
    distance?: number;
}

function Carousel({ id, name, distance }: Props) {
    return (
        <div key={id} className="image h-[13rem] bg-cover transition duration-700" style={{ backgroundImage: `url('https://support.content.office.net/en-us/media/4c10ecfd-3008-4b00-9f98-d41b6f899c2d.png')` }}>
            <div className="image__overlay duration-500">
                <h2 className="image__overlay__title">{name}</h2>
                <p className="text-sm">Khoảng cách: {distance !== undefined ? distance.toFixed(2) : 'N/A'} km</p>
                <Link type="button" href={`/destinations/${id}`} className="btn btn-dark">Xem thêm</Link>
            </div>
        </div>
    );
}

export default Carousel;