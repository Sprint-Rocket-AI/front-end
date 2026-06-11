import { Panel } from '@xyflow/react';

interface Props {
    isAddingNode: boolean;
    setIsAddingNode: (val: boolean) => void;
    expanded: boolean;
    setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}

export const DiagramHeaderPanel = ({ isAddingNode, setIsAddingNode, expanded, setExpanded }: Props) => {
    return (
        <Panel position="top-left" className="bg-transparent shadow-none">
            <div className="flex flex-col gap-2">
                <h1 className="text-lg font-bold">Mapa Mental APV-123</h1>
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsAddingNode(true)}
                        className="px-3 py-1 text-sm border rounded-md shadow"
                    >
                        ➕ Nodo
                    </button>
                    <button
                        onClick={() => setExpanded((prev) => !prev)}
                        className="px-3 py-1 text-sm border rounded-md shadow"
                    >
                        {expanded ? 'Ocultar detalle' : 'Ver detalle'}
                    </button>
                </div>
                {expanded && (
                    <div className="bg-white dark:bg-neutral-800 text-black dark:text-white shadow-md rounded-md p-4 w-[500px] max-w-[90vw]">
                        <p className="text-sm">
                            Lorem ipsum dolor sit amet consectetur, adipisicing elit...
                        </p>
                    </div>
                )}
            </div>
        </Panel>
    );
};
