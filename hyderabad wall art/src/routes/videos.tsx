import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import livingRoomImg from "@/assets/service-living-room.jpg";
import hotelImg from "@/assets/service-hotel.jpg";
import threeDImg from "@/assets/service-3d-painting.jpg";
import kidsRoomImg from "@/assets/service-kids-room.jpg";
import officeImg from "@/assets/service-office.jpg";
import staircaseImg from "@/assets/service-staircase.jpg";

export const Route = createFileRoute("/videos")({
  head: () => ({
    meta: [
      { title: "Videos — Hyderabad Wall Arts" },
      { name: "description", content: "Watch our wall art transformation videos and project showcases." },
      { property: "og:title", content: "Videos — Hyderabad Wall Arts" },
      { property: "og:description", content: "Watch wall art transformation videos." },
    ],
  }),
  component: VideosPage,
});

const videos = [
  { title: "Living Room Mural Transformation", id: "dQw4w9WgXcQ", thumbnail: livingRoomImg, category: "Home" },
  { title: "Hotel Lobby Art Installation", id: "dQw4w9WgXcQ", thumbnail: hotelImg, category: "Commercial" },
  { title: "3D Wall Painting Process", id: "dQw4w9WgXcQ", thumbnail: threeDImg, category: "3D Art" },
  { title: "Kids Room Cartoon Painting", id: "dQw4w9WgXcQ", thumbnail: kidsRoomImg, category: "Home" },
  { title: "Office Wall Mural Design", id: "dQw4w9WgXcQ", thumbnail: officeImg, category: "Commercial" },
  { title: "Staircase Wall Art Showcase", id: "dQw4w9WgXcQ", thumbnail: staircaseImg, category: "Home" },
];

function VideosPage() {
  const [openVideo, setOpenVideo] = useState<string | null>(null);

  return (
    <div>
      <section className="py-20 bg-navy">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-gold/20 text-gold text-sm font-semibold tracking-wider uppercase mb-4">Watch & Learn</span>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-white">Our Videos</h1>
            <p className="mt-4 text-white/70 text-lg">Watch our wall art transformations in action</p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-xl transition-all group cursor-pointer"
                onClick={() => setOpenVideo(video.id)}
              >
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-navy/30 group-hover:bg-navy/50 transition-colors flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl">
                      <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider">{video.category}</span>
                  <h3 className="font-heading font-semibold text-lg text-foreground mt-1">{video.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Popup */}
      <AnimatePresence>
        {openVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-navy/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setOpenVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setOpenVideo(null)}
                className="absolute -top-12 right-0 text-white hover:text-gold transition-colors z-10"
              >
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <iframe
                src={`https://www.youtube.com/embed/${openVideo}?autoplay=1`}
                className="w-full h-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
                title="Video player"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
