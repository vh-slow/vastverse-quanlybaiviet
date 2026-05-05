import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white">
            <section className="relative overflow-hidden pt-20 pb-24 lg:pt-32 lg:pb-40">
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
                    <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
                    <div className="absolute bottom-[-20%] left-[20%] w-[40%] h-[40%] bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 font-semibold text-sm mb-6 border border-blue-100">
                        <i className="fa-solid fa-rocket"></i>
                        <span>Khám phá vũ trụ tri thức</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight">
                        Chào mừng đến với <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                            VastVerse
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                        Nơi hội tụ của những tâm hồn đam mê công nghệ, khao khát
                        sáng tạo và mong muốn chia sẻ những giá trị đích thực
                        đến cộng đồng.
                    </p>
                </div>
            </section>

            <section className="py-12 bg-gray-900 text-white">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-gray-800">
                        <div className="p-4">
                            <p className="text-4xl font-extrabold text-blue-400 mb-2">
                                10K+
                            </p>
                            <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                                Người dùng
                            </p>
                        </div>
                        <div className="p-4">
                            <p className="text-4xl font-extrabold text-purple-400 mb-2">
                                50K+
                            </p>
                            <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                                Bài viết
                            </p>
                        </div>
                        <div className="p-4">
                            <p className="text-4xl font-extrabold text-indigo-400 mb-2">
                                1M+
                            </p>
                            <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                                Lượt xem
                            </p>
                        </div>
                        <div className="p-4">
                            <p className="text-4xl font-extrabold text-pink-400 mb-2">
                                24/7
                            </p>
                            <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                                Hoạt động
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 lg:py-32 bg-gray-50">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4">
                            Giá trị cốt lõi
                        </h2>
                        <p className="text-gray-500 max-w-2xl mx-auto">
                            Chúng tôi xây dựng nền tảng dựa trên sự tôn trọng
                            trải nghiệm người dùng và đam mê bất tận với công
                            nghệ.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl mb-6">
                                <i className="fa-solid fa-code"></i>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                                Công Nghệ Đột Phá
                            </h3>
                            <p className="text-gray-500 leading-relaxed">
                                Áp dụng những framework hiện đại nhất như React,
                                Next.js, và kiến trúc Full-stack để mang lại
                                trải nghiệm mượt mà, tối giản nhưng vô cùng mạnh
                                mẽ.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                            <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center text-2xl mb-6">
                                <i className="fa-solid fa-earth-americas"></i>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                                Không Gian Sáng Tạo
                            </h3>
                            <p className="text-gray-500 leading-relaxed">
                                Một không gian số rộng lớn, không giới hạn. Nơi
                                bạn có thể tự do phác họa ý tưởng, chia sẻ dòng
                                suy nghĩ và thiết kế thế giới của riêng mình.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl mb-6">
                                <i className="fa-solid fa-user-astronaut"></i>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                                Cộng Đồng Gắn Kết
                            </h3>
                            <p className="text-gray-500 leading-relaxed">
                                Kết nối những bộ óc lập trình viên và những
                                người sáng tạo nội dung. Cùng nhau học hỏi,
                                tương tác và phát triển một cộng đồng lành mạnh.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 lg:py-32">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row items-center border border-gray-800">
                        <div className="md:w-1/2 p-10 md:p-16 text-white text-center md:text-left">
                            <h2 className="text-3xl font-extrabold mb-2">
                                Người kiến tạo
                            </h2>
                            <p className="text-gray-400 mb-6 font-medium tracking-wide uppercase text-sm">
                                Full-stack Developer & Founder
                            </p>
                            <p className="text-gray-300 leading-relaxed mb-8 italic">
                                "Sứ mệnh của VastVerse là tạo ra một sân chơi
                                công nghệ tinh gọn, nơi mọi người không chỉ lướt
                                xem nội dung, mà còn truyền cảm hứng cho nhau
                                bằng những dòng code và câu chuyện thường nhật."
                            </p>
                            <div>
                                <h4 className="text-xl font-bold text-blue-400">
                                    Vi Ngọc Hiệp
                                </h4>
                                <p className="text-sm text-gray-500 mt-1">
                                    @vh.slow
                                </p>
                            </div>
                        </div>
                        <div className="md:w-1/2 w-full h-full min-h-[400px] relative bg-gray-800">
                            <img
                                src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop"
                                alt="Coding Workspace"
                                className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-40 h-40 rounded-full border-4 border-gray-900 shadow-2xl overflow-hidden bg-gray-100 z-10 relative">
                                    <img
                                        src="https://placehold.co/400x400/e0e7ff/3730a3?text=VNH"
                                        alt="Vi Ngọc Hiệp"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 bg-white text-center">
                <div className="container mx-auto px-4 max-w-3xl">
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-6">
                        Sẵn sàng để bắt đầu hành trình?
                    </h2>
                    <p className="text-lg text-gray-500 mb-10">
                        Đăng ký ngay hôm nay để trở thành một phần của hệ sinh
                        thái VastVerse. Khám phá, tương tác và chia sẻ những câu
                        chuyện của bạn.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                        <Link
                            href="/register"
                            className="px-8 py-4 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 w-full sm:w-auto"
                        >
                            Tham gia ngay
                        </Link>
                        <Link
                            href="/feed"
                            className="px-8 py-4 bg-gray-100 text-gray-900 font-bold rounded-full hover:bg-gray-200 transition-colors w-full sm:w-auto"
                        >
                            Lướt Bảng tin
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
