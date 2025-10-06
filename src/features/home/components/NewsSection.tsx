import { useState } from "react";

type NewsItem = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  date: string;
};

const newsData: NewsItem[] = [
  {
    id: 1,
    title: "Xu hướng thời trang thu đông 2025",
    description:
      "Khám phá các xu hướng thời trang mới nhất mùa thu đông năm nay với phong cách thanh lịch và cá tính.",
    imageUrl: "/placeholder.png",
    date: "05/10/2025",
  },
  {
    id: 2,
    title: "Bí quyết phối đồ công sở tinh tế",
    description:
      "Những gợi ý phối đồ công sở giúp bạn tự tin và chuyên nghiệp mỗi ngày đi làm.",
    imageUrl: "/placeholder.png",
    date: "03/10/2025",
  },
  {
    id: 3,
    title: "Top 5 thương hiệu áo khoác nổi bật",
    description:
      "Danh sách những thương hiệu áo khoác được ưa chuộng nhất với thiết kế và chất liệu cao cấp.",
    imageUrl: "/placeholder.png",
    date: "01/10/2025",
  },
  {
    id: 4,
    title: "Phụ kiện không thể thiếu mùa hè này",
    description:
      "Khám phá những món phụ kiện giúp bạn nổi bật và sành điệu hơn trong mùa hè năm nay.",
    imageUrl: "/placeholder.png",
    date: "28/09/2025",
  },
  {
    id: 5,
    title: "Cách bảo quản quần áo bền lâu",
    description:
      "Một vài mẹo đơn giản giúp quần áo của bạn luôn như mới và kéo dài tuổi thọ của vải.",
    imageUrl: "/placeholder.png",
    date: "25/09/2025",
  },
];

export default function NewsSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const itemsPerSlide = 3;

  const totalSlides = Math.ceil(newsData.length / itemsPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const startIndex = currentSlide * itemsPerSlide;
  const visibleItems = newsData.slice(startIndex, startIndex + itemsPerSlide);

  return (
    <div className="container-fluid testimonial py-5">
      <div className="container py-5">
        <div className="testimonial-header text-center mb-5">
          <h4 className="text-primary">Tin tức mới nhất</h4>
          <h1 className="display-5 mb-4 text-dark">
            Cập nhật xu hướng thời trang
          </h1>
        </div>

        {/* Carousel News */}
        <div className="position-relative">
          <div className="row g-4">
            {visibleItems.map((news) => (
              <div key={news.id} className="col-lg-4 col-md-6">
                <div className="bg-light rounded p-3 h-100 shadow-sm">
                  <div className="position-relative">
                    <img
                      src={news.imageUrl}
                      alt={news.title}
                      className="img-fluid rounded w-100"
                      style={{ height: "220px", objectFit: "cover" }}
                    />
                    <span className="badge bg-secondary position-absolute top-0 start-0 m-3">
                      {news.date}
                    </span>
                  </div>
                  <div className="p-3">
                    <h5 className="text-dark fw-bold">{news.title}</h5>
                    <p className="text-muted mb-3">{news.description}</p>
                    <a
                      href="#"
                      className="btn btn-outline-primary btn-sm rounded-pill"
                    >
                      Xem thêm
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          {totalSlides > 1 && (
            <>
              <button
                className="btn btn-secondary rounded-circle position-absolute top-50 start-0 translate-middle-y"
                style={{ width: "45px", height: "45px" }}
                onClick={prevSlide}
              >
                <i className="fa fa-chevron-left"></i>
              </button>
              <button
                className="btn btn-secondary rounded-circle position-absolute top-50 end-0 translate-middle-y"
                style={{ width: "45px", height: "45px" }}
                onClick={nextSlide}
              >
                <i className="fa fa-chevron-right"></i>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
