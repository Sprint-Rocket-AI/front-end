import type { DocumentoSistemaRequestInterface } from "../../interfaces/DocumentoSistemaRequestInterface";

interface SistemaViewerProps {
  data: DocumentoSistemaRequestInterface;
}

export const SistemaViewer = ({ data }: SistemaViewerProps) => (
  <div className="space-y-4">
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Tipo de Sistema</p>
        <span className="inline-block mt-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-orange-500/10 text-orange-500 dark:bg-orange-500/20">
          {data.tipo || "No especificado"}
        </span>
      </div>
    </div>

    {data.stack && data.stack.length > 0 && (
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Tecnologías / Tech Stack</p>
        <div className="flex flex-wrap gap-2">
          {data.stack.map((tech, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-700 border border-slate-200/50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700/50"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    )}

    {data.devs && data.devs.length > 0 && (
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Desarrolladores</p>
        <div className="flex flex-wrap gap-2">
          {data.devs.map((dev, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
            >
              👤 {dev}
            </span>
          ))}
        </div>
      </div>
    )}

    {data.urlRepos && data.urlRepos.length > 0 && (
      <div className="space-y-1.5">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Repositorios</p>
        <ul className="space-y-1">
          {data.urlRepos.map((repo, idx) => (
            <li key={idx}>
              <a
                href={repo}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-500 hover:underline flex items-center gap-1"
              >
                🔗 {repo}
              </a>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);
