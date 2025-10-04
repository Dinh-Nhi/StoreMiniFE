// src/features/home/components/TestimonialSection.tsx

type Testimonial = {
  id: number;
  name: string;
  profession: string;
  message: string;
  imageUrl: string;
  rating: number;
};

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    profession: "Food Blogger",
    message: "The quality of fruits and vegetables from Fruitables is exceptional. Fresh, organic, and delivered right to my doorstep. Highly recommended!",
    imageUrl: "/placeholder.png",
    rating: 4
  },
  {
    id: 2,
    name: "Michael Chen",
    profession: "Chef",
    message: "As a professional chef, I demand the highest quality ingredients. Fruitables consistently delivers fresh, premium produce that enhances every dish.",
    imageUrl: "/placeholder.png",
    rating: 5
  },
  {
    id: 3,
    name: "Emily Davis",
    profession: "Nutritionist",
    message: "I recommend Fruitables to all my clients. Their organic produce is not only delicious but also packed with nutrients. Perfect for a healthy lifestyle.",
    imageUrl: "/placeholder.png",
    rating: 5
  }
];

export default function TestimonialSection() {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <i 
        key={index}
        className={`fas fa-star ${index < rating ? 'text-primary' : ''}`}
      ></i>
    ));
  };

  return (
    <div className="container-fluid testimonial py-5">
      <div className="container py-5">
        <div className="testimonial-header text-center">
          <h4 className="text-primary">Our Testimonial</h4>
          <h1 className="display-5 mb-5 text-dark">Our Client Saying!</h1>
        </div>
        <div className="row g-4">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="col-lg-4">
              <div className="testimonial-item img-border-radius bg-light rounded p-4">
                <div className="position-relative">
                  <i 
                    className="fa fa-quote-right fa-2x text-secondary position-absolute" 
                    style={{bottom: '30px', right: '0'}}
                  ></i>
                  <div className="mb-4 pb-4 border-bottom border-secondary">
                    <p className="mb-0">{testimonial.message}</p>
                  </div>
                  <div className="d-flex align-items-center flex-nowrap">
                    <div className="bg-secondary rounded">
                      <img 
                        src={testimonial.imageUrl} 
                        className="img-fluid rounded" 
                        style={{width: '100px', height: '100px'}} 
                        alt={testimonial.name}
                      />
                    </div>
                    <div className="ms-4 d-block">
                      <h4 className="text-dark">{testimonial.name}</h4>
                      <p className="m-0 pb-3">{testimonial.profession}</p>
                      <div className="d-flex pe-5">
                        {renderStars(testimonial.rating)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
