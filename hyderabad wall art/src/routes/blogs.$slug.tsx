import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import livingRoomImg from "@/assets/service-living-room.jpg";
import threeDImg from "@/assets/service-3d-painting.jpg";
import muralImg from "@/assets/service-mural.jpg";
import hotelImg from "@/assets/service-hotel.jpg";
import kidsRoomImg from "@/assets/service-kids-room.jpg";
import stencilImg from "@/assets/service-stencil.jpg";
import bedroomImg from "@/assets/service-bedroom.jpg";
import staircaseImg from "@/assets/service-staircase.jpg";

export const Route = createFileRoute("/blogs/$slug")({
  head: ({ params }) => {
    const blog = blogData[params.slug];
    return {
      meta: [
        { title: blog ? `${blog.title} — Hyderabad Wall Arts` : "Blog — Hyderabad Wall Arts" },
        { name: "description", content: blog?.excerpt || "Read our latest wall art blog." },
        { property: "og:title", content: blog ? `${blog.title} — Hyderabad Wall Arts` : "Blog" },
        { property: "og:description", content: blog?.excerpt || "" },
      ],
    };
  },
  component: BlogDetailPage,
});

interface BlogPost {
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
  galleryImages: string[];
  content: { heading: string; text: string }[];
}

const blogData: Record<string, BlogPost> = {
  "living-room-wall-art-ideas": {
    title: "Top Living Room Wall Art Ideas for Modern Homes",
    excerpt: "Discover the latest trends in wall art that are transforming living rooms into stunning spaces.",
    date: "Apr 15, 2026",
    category: "Trends",
    image: livingRoomImg,
    galleryImages: [livingRoomImg, bedroomImg, muralImg, threeDImg],
    content: [
      { heading: "Introduction", text: "Your living room is the heart of your home — it's where you entertain guests, relax with family, and express your personal style. Wall art is the most impactful way to transform this space from ordinary to extraordinary. In this guide, we'll explore the top wall art ideas that are trending in 2026 for modern Indian homes." },
      { heading: "Abstract & Contemporary Designs", text: "Abstract wall art continues to dominate modern living rooms. Bold geometric patterns, fluid color gradients, and textured abstract murals create stunning focal points. These designs work beautifully with minimalist furniture and contemporary interiors. Consider large-scale abstract pieces that span an entire accent wall for maximum impact." },
      { heading: "Nature-Inspired Murals", text: "Bring the outdoors inside with nature-inspired wall murals. Tropical leaf patterns, serene mountain landscapes, and ocean-themed designs create a calming atmosphere. These murals pair perfectly with natural materials like wood and stone in your interior design." },
      { heading: "Best Color Combinations", text: "The right color palette can make or break your wall art. Trending combinations include navy and gold for luxury, sage green and cream for tranquility, terracotta and white for warmth, and charcoal with metallic accents for sophistication. Always consider your existing furniture and lighting when choosing colors." },
      { heading: "Budget-Friendly Ideas", text: "Premium wall art doesn't have to break the bank. Stencil patterns offer beautiful results at lower costs. Textured paint techniques like sponging or rag rolling create unique effects. Accent walls with a single bold color or geometric pattern are also cost-effective ways to make a statement." },
      { heading: "Premium Design Ideas", text: "For those seeking luxury, consider 3D wall panels, hand-painted murals by professional artists, gold leaf accents, or custom wood-carved installations. These premium options create one-of-a-kind spaces that reflect your personality and taste." },
      { heading: "Conclusion", text: "Your living room wall art should reflect your personality while complementing your interior design. Whether you choose abstract murals, nature-inspired themes, or premium 3D installations, the key is to work with experienced artists who can bring your vision to life. Contact Hyderabad Wall Arts for a free consultation and transform your living room today." },
    ],
  },
  "how-to-choose-wall-art": {
    title: "How to Choose the Right Wall Art for Your Space",
    excerpt: "A comprehensive guide to selecting wall art that complements your interior decor.",
    date: "Apr 10, 2026",
    category: "Tips",
    image: muralImg,
    galleryImages: [muralImg, livingRoomImg, bedroomImg, staircaseImg],
    content: [
      { heading: "Introduction", text: "Choosing the right wall art can transform any room from mundane to magnificent. But with so many options available, how do you select the perfect piece? This guide walks you through everything you need to consider when choosing wall art for your home or office." },
      { heading: "Consider Your Space", text: "The size and layout of your room play a crucial role in wall art selection. Large rooms can accommodate oversized murals and multi-panel installations, while smaller spaces benefit from strategically placed accent walls. Measure your walls carefully and visualize the scale before committing to a design." },
      { heading: "Match Your Interior Style", text: "Your wall art should complement your existing decor. Modern minimalist interiors pair well with abstract designs. Traditional homes look stunning with classical murals. Industrial spaces shine with textured concrete art. The key is creating harmony between your furniture, colors, and wall art." },
      { heading: "Color Psychology", text: "Colors affect mood and atmosphere. Blues and greens promote calm and relaxation — perfect for bedrooms. Reds and oranges energize spaces — ideal for living rooms and restaurants. Neutrals create sophistication — great for offices. Choose colors that align with the purpose of each room." },
      { heading: "Working with Professional Artists", text: "The difference between DIY and professional wall art is dramatic. Professional artists bring technical skill, creative vision, and experience. They can advise on design, colors, and techniques that best suit your space. Always review portfolios and discuss your vision in detail before starting a project." },
      { heading: "Conclusion", text: "The right wall art investment pays dividends in beauty and satisfaction for years to come. Take your time, consider all factors, and work with trusted professionals. Hyderabad Wall Arts offers free consultations to help you make the perfect choice." },
    ],
  },
  "rise-of-3d-wall-paintings": {
    title: "The Rise of 3D Wall Paintings in Indian Homes",
    excerpt: "3D wall paintings are becoming increasingly popular in Indian households.",
    date: "Apr 5, 2026",
    category: "Inspiration",
    image: threeDImg,
    galleryImages: [threeDImg, livingRoomImg, staircaseImg, muralImg],
    content: [
      { heading: "Introduction", text: "3D wall paintings have taken the Indian interior design world by storm. These incredible optical illusions create depth and dimension on flat walls, making rooms feel larger and more dynamic. Let's explore why this trend is growing rapidly." },
      { heading: "What Makes 3D Paintings Special", text: "Unlike traditional flat paintings, 3D wall art uses advanced techniques like shadow play, forced perspective, and layered colors to create the illusion of depth. When viewed from the right angle, these paintings appear to leap off the wall, creating an immersive experience." },
      { heading: "Popular 3D Themes", text: "The most requested 3D designs include realistic nature scenes (waterfalls, forests, ocean depths), architectural illusions (windows, balconies, corridors), abstract geometric 3D patterns, and themed designs for kids' rooms (underwater worlds, space themes). Each creates a unique atmosphere." },
      { heading: "Where to Use 3D Paintings", text: "3D paintings work beautifully in living rooms as focal points, in kids' rooms for imagination, in hotel lobbies for wow factor, and in restaurants for Instagram-worthy interiors. The key is choosing a wall that gets attention and has good viewing angles." },
      { heading: "The Process", text: "Creating a 3D mural requires exceptional skill. The artist first sketches the design considering perspective and viewing angle. Then, layer by layer, the painting is built up using special techniques. The entire process can take several days for complex designs." },
      { heading: "Conclusion", text: "3D wall paintings represent the cutting edge of wall art. They transform ordinary walls into extraordinary experiences. If you're looking to add a wow factor to your space, contact Hyderabad Wall Arts — our team specializes in hyper-realistic 3D murals." },
    ],
  },
  "commercial-wall-art-business": {
    title: "Commercial Wall Art: Transform Your Business Space",
    excerpt: "Learn how wall art can enhance your business environment and attract customers.",
    date: "Mar 28, 2026",
    category: "Commercial",
    image: hotelImg,
    galleryImages: [hotelImg, stencilImg, muralImg, livingRoomImg],
    content: [
      { heading: "Introduction", text: "In today's competitive business landscape, first impressions matter more than ever. Commercial wall art is a powerful tool that can enhance your brand identity, attract customers, and create memorable experiences. Let's explore how businesses across Hyderabad are leveraging wall art." },
      { heading: "Hotels & Restaurants", text: "The hospitality industry leads in wall art adoption. Themed murals in dining areas create unique atmospheres that keep customers coming back. Luxury hotels use custom wall art to reinforce their brand story. Instagram-worthy interiors drive organic social media marketing." },
      { heading: "Office Spaces", text: "Modern offices are moving beyond plain white walls. Motivational murals in break rooms boost morale. Brand identity walls in reception areas impress clients. Creative art in collaboration spaces stimulates innovation. Wall art can even help with wayfinding in large office complexes." },
      { heading: "Retail & Shops", text: "Retail wall art creates an immersive shopping experience. Store interiors with artistic walls encourage customers to spend more time (and money). Interactive or Instagram-worthy wall art generates free social media publicity." },
      { heading: "ROI of Commercial Wall Art", text: "The return on investment for commercial wall art is significant. Studies show that aesthetically pleasing environments increase customer satisfaction by 40%, employee productivity by 15%, and social media mentions by 300%. Wall art is one of the most cost-effective interior upgrades." },
      { heading: "Conclusion", text: "Commercial wall art is not just decoration — it's a strategic business investment. Whether you run a hotel, restaurant, office, or retail store, the right wall art can transform your space and your bottom line. Contact Hyderabad Wall Arts for a free commercial consultation." },
    ],
  },
  "behind-the-scenes-mural": {
    title: "Behind the Scenes: Creating a Large-Scale Mural",
    excerpt: "Take a peek into our artistic process from concept to completion.",
    date: "Mar 20, 2026",
    category: "Process",
    image: stencilImg,
    galleryImages: [stencilImg, muralImg, threeDImg, hotelImg],
    content: [
      { heading: "Introduction", text: "Ever wondered how a blank wall transforms into a breathtaking mural? In this behind-the-scenes look, we'll walk you through our complete process — from the first consultation to the final brushstroke." },
      { heading: "Step 1: Consultation & Concept", text: "Every mural begins with a conversation. We discuss your vision, the space, lighting conditions, and budget. Our design team then creates concept sketches — usually 2-3 options — for your review. This collaborative process ensures the final design perfectly matches your expectations." },
      { heading: "Step 2: Design Refinement", text: "Once you select a concept, we refine it digitally. We create detailed color studies, mock up the design on photos of your actual wall, and finalize every detail. This step prevents surprises and ensures you love the design before any paint touches the wall." },
      { heading: "Step 3: Wall Preparation", text: "Proper preparation is crucial for a lasting mural. We clean, repair, and prime the wall surface. We protect surrounding areas with drop cloths and tape. The preparation alone can take a full day for large walls." },
      { heading: "Step 4: Painting", text: "Our artists begin with an outline, then work in layers from background to foreground. We use premium-quality paints that resist fading and moisture. Complex murals can take 3-7 days depending on size and detail. Throughout the process, we keep the workspace clean and organized." },
      { heading: "Step 5: Finishing & Protection", text: "After the painting is complete, we apply a protective sealant that guards against UV damage, moisture, and dust. We do a thorough cleanup of the workspace. Finally, we walk you through care instructions to ensure your mural stays beautiful for years." },
      { heading: "Conclusion", text: "Creating a mural is a journey of artistic collaboration. From concept to completion, every step is handled with care and professionalism. Want to see this process in action? Contact Hyderabad Wall Arts for a free consultation on your next mural project." },
    ],
  },
  "kids-room-wall-art-ideas": {
    title: "Creative Kids Room Wall Art Ideas",
    excerpt: "Transform your child's room into a magical wonderland with creative wall art ideas.",
    date: "Mar 15, 2026",
    category: "Ideas",
    image: kidsRoomImg,
    galleryImages: [kidsRoomImg, threeDImg, livingRoomImg, muralImg],
    content: [
      { heading: "Introduction", text: "A child's room should be a place of wonder, imagination, and joy. Wall art is the most effective way to create a magical environment that stimulates creativity and makes your child excited about their space. Here are our top ideas for kids' room wall art." },
      { heading: "Cartoon & Character Themes", text: "Popular cartoon characters and beloved movie themes never go out of style. From Disney princesses to superhero universes, cartoon wall art creates instant excitement. We can paint any character or scene your child loves, creating a truly personalized space." },
      { heading: "Educational Murals", text: "Wall art can be both beautiful and educational. World maps, solar system murals, alphabet walls, and number gardens combine learning with visual appeal. These designs grow with your child and support their educational journey." },
      { heading: "Fantasy & Adventure Themes", text: "Underwater worlds with dolphins and coral reefs, enchanted forests with fairies and woodland creatures, outer space adventures with rockets and planets — fantasy themes ignite imagination and create immersive environments that fuel creative play." },
      { heading: "Safety First", text: "We exclusively use child-safe, non-toxic, low-VOC paints for kids' rooms. Our paints are odorless and hypoallergenic. We also use easy-to-clean finishes so small handprints and scuffs can be wiped away without damaging the artwork." },
      { heading: "Age-Appropriate Design Tips", text: "For toddlers (0-3), use bright primary colors and simple shapes. For young children (4-7), cartoon characters and fantasy scenes work best. For tweens (8-12), consider more sophisticated themes like sports, music, or nature. The design should evolve with your child." },
      { heading: "Conclusion", text: "Your child's room wall art should spark joy and imagination. Whether it's a full-wall mural or a themed accent wall, the right design can transform their room into their favorite place in the house. Contact Hyderabad Wall Arts for a free kids' room consultation." },
    ],
  },
};

function BlogDetailPage() {
  const { slug } = Route.useParams();
  const blog = blogData[slug];

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="font-heading text-4xl font-bold text-foreground">Blog Not Found</h1>
          <p className="mt-4 text-muted-foreground">The blog post you're looking for doesn't exist.</p>
          <Link to="/blogs" className="mt-6 inline-block px-6 py-3 gradient-primary text-white rounded-lg font-semibold">
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Banner */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/70 to-navy/40" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <Link to="/blogs" className="inline-flex items-center gap-2 text-gold hover:text-gold/80 transition-colors mb-6">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              Back to Blogs
            </Link>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">{blog.category}</span>
              <span className="text-white/60 text-sm">{blog.date}</span>
            </div>
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">{blog.title}</h1>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {blog.content.map((section, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="mb-10"
            >
              <h2 className="font-heading text-2xl font-bold text-foreground mb-4">{section.heading}</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">{section.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Image Gallery */}
      <section className="py-16 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-bold text-foreground text-center mb-10">Related Wall Art Visuals</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {blog.galleryImages.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="aspect-square rounded-xl overflow-hidden group shadow-lg"
              >
                <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-90" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl font-bold text-white">Get Free Consultation</h2>
          <p className="mt-3 text-white/80">Inspired by what you read? Let us bring your wall art vision to life.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link to="/contact" className="px-8 py-3.5 bg-white text-primary rounded-lg font-semibold hover:bg-white/90 transition-colors shadow-lg">Contact Us</Link>
            <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="px-8 py-3.5 bg-[#25D366] text-white rounded-lg font-semibold hover:bg-[#25D366]/90 transition-colors shadow-lg">WhatsApp Us</a>
          </div>
        </div>
      </section>
    </div>
  );
}
