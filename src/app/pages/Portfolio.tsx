import { useState } from "react";
import { Link } from "react-router";
import Masonry from "react-responsive-masonry";
import { motion } from "motion/react";

export function Portfolio() {
  const [activeFilter, setActiveFilter] = useState("semua");

  const filters = ["Semua", "Restoran", "Klinik", "Properti", "Jasa"];

  const projects = [
    {
      id: 1,
      title: "Kafe Nusantara",
      category: "Restoran",
      image: "🍽️",
      color: "from-orange-100 to-red-100",
      size: "large"
    },
    {
      id: 2,
      title: "Klinik Sehat Bersama",
      category: "Klinik",
      image: "🏥",
      color: "from-blue-100 to-cyan-100",
      size: "small"
    },
    {
      id: 3,
      title: "Properti Prima",
      category: "Properti",
      image: "🏠",
      color: "from-green-100 to-emerald-100",
      size: "medium"
    },
    {
      id: 4,
      title: "Toko Buku Pintar",
      category: "Jasa",
      image: "📚",
      color: "from-purple-100 to-pink-100",
      size: "small"
    },
    {
      id: 5,
      title: "Restoran Padang Sederhana",
      category: "Restoran",
      image: "🍛",
      color: "from-yellow-100 to-orange-100",
      size: "medium"
    },
    {
      id: 6,
      title: "Spa & Wellness",
      category: "Jasa",
      image: "💆",
      color: "from-pink-100 to-purple-100",
      size: "large"
    },
    {
      id: 7,
      title: "Rumah Sakit Harapan",
      category: "Klinik",
      image: "🏥",
      color: "from-teal-100 to-blue-100",
      size: "small"
    },
    {
      id: 8,
      title: "Apartemen Modern",
      category: "Properti",
      image: "🏢",
      color: "from-gray-100 to-slate-100",
      size: "medium"
    }
  ];

  const filteredProjects = activeFilter === "semua"
    ? projects
    : projects.filter(p => p.category.toLowerCase() === activeFilter.toLowerCase());

  const getHeight = (size: string) => {
    switch (size) {
      case "large": return "h-96";
      case "medium": return "h-72";
      case "small": return "h-64";
      default: return "h-80";
    }
  };

  return (
    <div className="pt-24 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-light mb-4" style={{ fontFamily: "'Fraunces', serif" }}>
            Portofolio Kami
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Website profesional yang telah kami bangun untuk berbagai bisnis di Indonesia
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-center gap-3 mb-12">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter.toLowerCase())}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                activeFilter === filter.toLowerCase()
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <Masonry columnsCount={3} gutter="1.5rem">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Link to={`/portfolio/${project.id}`}>
                <div
                  className={`relative ${getHeight(project.size)} rounded-xl overflow-hidden group cursor-pointer`}
                >
                  {/* Image/Background */}
                  <div className={`w-full h-full bg-gradient-to-br ${project.color} flex items-center justify-center`}>
                    <span className="text-7xl">{project.image}</span>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-sm text-white/80 mb-1">{project.category}</p>
                      <h3 className="text-2xl font-semibold text-white">{project.title}</h3>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </Masonry>

        {filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500">Tidak ada proyek dalam kategori ini</p>
          </div>
        )}
      </div>
    </div>
  );
}
