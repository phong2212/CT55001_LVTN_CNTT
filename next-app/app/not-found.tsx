export default function NotFound() {
    return (
        <>
            <main className="container mx-auto grid min-h-full place-items-center pt-24 mt-24 caret-transparent">
                <div className="text-center pt-10">
                    <p className="text-base font-semibold text-indigo-600">404</p>
                    <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">Trang không tồn tại</h1>
                    <p className="mt-6 text-base leading-7 text-gray-600">Xin lỗi, chúng tôi không thể tìm thấy trang bạn đang tìm kiếm. </p>
                    <a className="link" href='/'>Về trang chủ</a>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                    </div>
                </div>
            </main>
        </>
    )
}
