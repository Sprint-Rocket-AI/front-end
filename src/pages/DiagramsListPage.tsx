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
        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:max-w-[80vw] lg:px-8 2xl:max-w-[1600px]">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Diagramas</h1>
                <p className="mt-2 text-slate-600 dark:text-slate-400">
                    Explora y gestiona tus diagramas de arquitectura y flujo.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {mockDiagrams.map((diagram) => (
                    <div
                        key={diagram.id}
                        className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
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
                                className="inline-flex items-center justify-center rounded-lg bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-600 transition hover:bg-orange-100 dark:bg-orange-500/10 dark:text-orange-400 dark:hover:bg-orange-500/20"
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
