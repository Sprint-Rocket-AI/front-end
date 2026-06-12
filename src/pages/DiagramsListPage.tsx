import { Link } from 'react-router-dom';

export const mockDiagrams = [
    {
        id: '1',
        title: 'Mapa Mental APV-123',
        description: 'Diagrama principal de arquitectura de la aplicación.',
        updatedAt: '2026-06-11'
    },
    {
        id: '2',
        title: 'Flujo de Autenticación',
        description: 'Diagrama detallado del proceso de login y registro.',
        updatedAt: '2026-06-10'
    },
    {
        id: '3',
        title: 'Base de Datos Relacional',
        description: 'Modelo Entidad-Relación de los usuarios y documentos.',
        updatedAt: '2026-06-09'
    }
];

export const DiagramsListPage = () => {
    return (
        <div className="mx-auto w-full max-w-[1280px] animate-fade-in">
            <div className="mb-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-orange-500">Sprint Rocket.AI — Diagramas</p>
                <h1 className="mt-1 text-3xl font-bold text-slate-900 dark:text-slate-100">Diagramas</h1>
                <p className="mt-2 text-slate-600 dark:text-slate-400">
                    Explora y gestiona tus diagramas de arquitectura y flujo.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {mockDiagrams.map((diagram) => (
                    <div
                        key={diagram.id}
                        className="panel panel-interactive flex flex-col justify-between !rounded-2xl"
                    >
                        <div>
                            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                                {diagram.title}
                            </h2>
                            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
                                {diagram.description}
                            </p>
                        </div>

                        <div className="mt-6 flex items-center justify-between">
                            <span className="text-xs text-slate-500 dark:text-slate-500">
                                {diagram.updatedAt}
                            </span>
                            <Link
                                to={`/diagram/${diagram.id}`}
                                className="inline-flex items-center justify-center rounded-lg bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-400 transition hover:bg-orange-500/20"
                            >
                                Ver más
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
