import { useEffect, useState } from "react";
import { fetchProjects } from "../services/projectService";

function ProjectItem({ project }) {
  const [imgIndex, setImgIndex] = useState(0);
  const images = project.images || [];
  const attachments = project.attachments || [];

  const prevImage = () =>
    setImgIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const nextImage = () =>
    setImgIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  return (
    <article className="border rounded-lg overflow-hidden flex flex-col">
      {images.length > 0 && (
        <div className="relative h-52 bg-gray-100">
          <img
            src={images[imgIndex]?.url}
            alt={images[imgIndex]?.name || project.title}
            className="w-full h-full object-cover"
          />
          {images.length > 1 && (
            <div className="absolute bottom-2 right-2 flex gap-1">
              <button
                type="button"
                onClick={prevImage}
                className="px-2 py-1 bg-black/70 text-white text-xs rounded"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={nextImage}
                className="px-2 py-1 bg-black/70 text-white text-xs rounded"
              >
                Next ({imgIndex + 1}/{images.length})
              </button>
            </div>
          )}
        </div>
      )}

      <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-bold text-lg">{project.title}</h3>
            {project.is_private && (
              <span className="text-xs px-2 py-0.5 border rounded">Private</span>
            )}
          </div>

          <p className="text-sm text-gray-700">{project.description}</p>

          {(project.tech || []).length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {project.tech.map((item, idx) => (
                <span key={idx} className="text-xs px-2 py-0.5 border rounded">
                  {item}
                </span>
              ))}
            </div>
          )}

          {attachments.length > 0 && (
            <div className="pt-2 space-y-1">
              <p className="text-xs font-semibold">Files:</p>
              <div className="flex flex-wrap gap-2">
                {attachments.map((file) => (
                  <a
                    key={file.path}
                    href={file.url}
                    target="_blank"
                    rel="noreferrer"
                    download={file.name}
                    className="text-xs underline"
                  >
                    {file.name}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {!project.is_private && (
          <div className="flex gap-3 pt-2">
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded"
              >
                Live
              </a>
            )}
            {project.code_url && (
              <a
                href={project.code_url}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 border text-sm rounded"
              >
                Code
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects()
      .then(setProjects)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6">Loading projects...</div>;

  return (
    <section id="projects" className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Projects</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectItem key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}