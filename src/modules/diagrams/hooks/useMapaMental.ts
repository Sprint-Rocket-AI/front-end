import { useState, useCallback, useEffect, useMemo } from 'react';
import {
    applyNodeChanges,
    applyEdgeChanges,
    addEdge,
    useReactFlow,
    type NodeChange,
    type EdgeChange,
    type Connection,
    type Edge,
    type Node
} from '@xyflow/react';
import { useHistory } from './useHistory';

const INITIAL_MARKDOWN = `# DESARROLLO
## EXTRA PRIMA (EN DESARROLLO - PABLO)
## RECIBOS PENDIENTES 

# DEUDA TECNICA
## STEP FUNCTION
### OMITIR ROLLBACK JOB CUANDO NO HAY ERRORES (CREAR LAMBDA) (OK)
### APLICAR PATRON batch-processing-with-step-functions-map-state
### ELIMINAR BUCKET POR PARAMETROS (OK)

## MIGRATION GLUE
### ORACLE 
#### USUARIO LECTURA APVC_AHORRO CON SOLO TABLAS UTILIZADAS
#### INSTANT_CLIENT
##### VALIDAR TIEMPO EN INGESTA MASIVA
#### DATALAKE
### MYSQL
#### ELIMINAR Y TESTEAR PING (OK)
### MANEJAR ERROR POLIZA (OK)

## QUADRATURE GLUE
### CONEXION SINGLETON (OK)

## MOTOR DE REGLAS
### IMPLEMETACIÓN NUEVAS ESTRATEGIAS

## PENDIENTE 
### CHECKMARX (OK)
### GET_METADATA (OK)
#### REGULARIZAR FECHA (OK)
#### INDEPOTENCIA = BATCH_ID POR PARAMETRO DEL STEP FUNCTION (OK)`;

// Helper to parse status from heading text
export const parseStatusFromLabel = (label: string) => {
    let status: 'PENDIENTE' | 'EN PROCESO' | 'TERMINADO' = 'PENDIENTE';
    let statusDetail = '';
    let cleanLabel = label;

    if (/\(OK\)\s*$/i.test(label)) {
        status = 'TERMINADO';
        cleanLabel = label.replace(/\(OK\)\s*$/i, '').trim();
    } else {
        const match = label.match(/\((EN DESARROLLO|EN PROCESO)(?:\s*-\s*([^)]+))?\)\s*$/i);
        if (match) {
            status = 'EN PROCESO';
            statusDetail = match[2] ? ` - ${match[2].trim()}` : '';
            cleanLabel = label.substring(0, match.index).trim();
        }
    }

    return { status, statusDetail, cleanLabel };
};

// Tree node definition for hierarchy building
interface TreeNode {
    id: string;
    label: string;
    status: 'PENDIENTE' | 'EN PROCESO' | 'TERMINADO';
    statusDetail?: string;
    collapsed?: boolean;
    children: TreeNode[];
    level: number;
}

// Convert flat nodes/edges back to tree structure
const buildTree = (nodes: Node[], edges: Edge[]): TreeNode[] => {
    const parentMap = new Map<string, string>(); // child -> parent
    edges.forEach(e => {
        parentMap.set(e.target, e.source);
    });

    const nodeMap = new Map<string, Node>();
    nodes.forEach(n => nodeMap.set(n.id, n));

    const childrenMap = new Map<string, string[]>(); // parent -> children
    edges.forEach(e => {
        if (!childrenMap.has(e.source)) {
            childrenMap.set(e.source, []);
        }
        childrenMap.get(e.source)!.push(e.target);
    });

    // Find roots: nodes in diagram that don't have parents
    const roots = nodes.filter(n => !parentMap.has(n.id));
    const visited = new Set<string>();

    const traverse = (nodeId: string, level: number): TreeNode | null => {
        if (visited.has(nodeId)) return null;
        visited.add(nodeId);

        const node = nodeMap.get(nodeId);
        if (!node) return null;

        const label = (node.data?.label as string) || '';
        const status = (node.data?.status as 'PENDIENTE' | 'EN PROCESO' | 'TERMINADO') || 'PENDIENTE';
        const statusDetail = (node.data?.statusDetail as string) || '';

        const childIds = childrenMap.get(nodeId) || [];
        const childrenNodes: TreeNode[] = [];
        childIds.forEach(cid => {
            const childTree = traverse(cid, level + 1);
            if (childTree) childrenNodes.push(childTree);
        });

        return {
            id: nodeId,
            label,
            status,
            statusDetail,
            collapsed: !!node.data?.collapsed,
            children: childrenNodes,
            level
        };
    };

    const tree: TreeNode[] = [];
    roots.forEach(r => {
        const t = traverse(r.id, 1);
        if (t) tree.push(t);
    });

    return tree;
};

// Convert tree structure back to Markdown text
const treeToMarkdown = (tree: TreeNode[]): string => {
    const lines: string[] = [];

    const stringifyNode = (node: TreeNode) => {
        const hashes = '#'.repeat(node.level);
        let suffix = '';
        if (node.status === 'TERMINADO') {
            suffix = ' (OK)';
        } else if (node.status === 'EN PROCESO') {
            suffix = ` (EN DESARROLLO${node.statusDetail || ''})`;
        }
        lines.push(`${hashes} ${node.label}${suffix}`);
        node.children.forEach(stringifyNode);
    };

    tree.forEach((root, idx) => {
        if (idx > 0) lines.push(''); // blank line between root trees
        stringifyNode(root);
    });

    return lines.join('\n');
};

// Auto-layout algorithm for the tree structure
export const layoutNodes = (nodes: Node[], edges: Edge[]): Node[] => {
    const parentMap = new Map<string, string>();
    edges.forEach(e => parentMap.set(e.target, e.source));

    const childrenMap = new Map<string, string[]>();
    edges.forEach(e => {
        if (!childrenMap.has(e.source)) childrenMap.set(e.source, []);
        childrenMap.get(e.source)!.push(e.target);
    });

    const nodeMap = new Map<string, Node>();
    nodes.forEach(n => nodeMap.set(n.id, n));

    const rootNodeIds = nodes.filter(n => !parentMap.has(n.id)).map(n => n.id);

    let currentY = 50;
    const positions = new Map<string, { x: number, y: number }>();

    const layoutNode = (nodeId: string, level: number): { x: number, y: number } => {
        const node = nodeMap.get(nodeId);
        const children = childrenMap.get(nodeId) || [];
        const isCollapsed = node?.data?.collapsed === true;

        const x = (level - 1) * 320; // Horizontal spacing between levels

        if (children.length === 0 || isCollapsed) {
            const y = currentY;
            currentY += 110; // Vertical spacing between siblings
            positions.set(nodeId, { x, y });
            return { x, y };
        }

        const childPositions = children
            .map(childId => {
                const childNode = nodeMap.get(childId);
                if (!childNode) return null;
                return { id: childId, pos: layoutNode(childId, level + 1) };
            })
            .filter(Boolean) as { id: string, pos: { x: number, y: number } }[];

        let y = 0;
        if (childPositions.length > 0) {
            const minY = childPositions[0].pos.y;
            const maxY = childPositions[childPositions.length - 1].pos.y;
            y = (minY + maxY) / 2;
        } else {
            y = currentY;
            currentY += 110;
        }

        positions.set(nodeId, { x, y });
        return { x, y };
    };

    rootNodeIds.forEach(rootId => {
        layoutNode(rootId, 1);
        currentY += 60; // Extra spacing between different trees
    });

    return nodes.map(node => {
        const pos = positions.get(node.id) || { x: 0, y: 0 };
        return {
            ...node,
            position: pos
        };
    });
};

// Check recursively if a node is hidden due to any collapsed ancestor
const isNodeHidden = (nodeId: string, nodesMap: Map<string, Node>, parentMap: Map<string, string>): boolean => {
    const parentId = parentMap.get(nodeId);
    if (!parentId) return false;

    const parentNode = nodesMap.get(parentId);
    if (!parentNode) return false;

    if (parentNode.data?.collapsed || isNodeHidden(parentId, nodesMap, parentMap)) {
        return true;
    }
    return false;
};

// Update visibility (hidden property) of nodes and edges
export const updateVisibility = (nodes: Node[], edges: Edge[]): { nodes: Node[], edges: Edge[] } => {
    const parentMap = new Map<string, string>();
    edges.forEach(e => parentMap.set(e.target, e.source));

    const nodesMap = new Map<string, Node>();
    nodes.forEach(n => nodesMap.set(n.id, n));

    const updatedNodes = nodes.map(node => {
        const hidden = isNodeHidden(node.id, nodesMap, parentMap);
        return {
            ...node,
            hidden
        };
    });

    const updatedNodesMap = new Map<string, Node>();
    updatedNodes.forEach(n => updatedNodesMap.set(n.id, n));

    const updatedEdges = edges.map(edge => {
        const sourceNode = updatedNodesMap.get(edge.source);
        const targetNode = updatedNodesMap.get(edge.target);
        const hidden = sourceNode?.hidden || targetNode?.hidden || sourceNode?.data?.collapsed;
        return {
            ...edge,
            hidden: !!hidden
        };
    });

    return { nodes: updatedNodes, edges: updatedEdges };
};

// Parse Markdown into nodes and edges
export const parseMarkdownToFlow = (markdown: string): { nodes: Node[], edges: Edge[] } => {
    const lines = markdown.split('\n');
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    const activeParents: { [level: number]: string } = {};
    let nodeIndex = 0;

    lines.forEach((line) => {
        const trimmed = line.trim();
        if (!trimmed) return;

        const hashMatch = trimmed.match(/^(#+)\s+(.*)$/);
        if (!hashMatch) return;

        const hashes = hashMatch[1];
        const level = hashes.length;
        const fullLabel = hashMatch[2];

        const { status, statusDetail, cleanLabel } = parseStatusFromLabel(fullLabel);
        const nodeId = `n-${nodeIndex++}`;

        nodes.push({
            id: nodeId,
            position: { x: 0, y: 0 },
            type: 'nodeMapaMental',
            data: {
                label: cleanLabel,
                status,
                statusDetail,
                collapsed: false,
            }
        });

        if (level > 1) {
            const parentId = activeParents[level - 1];
            if (parentId) {
                edges.push({
                    id: `e-${parentId}-${nodeId}`,
                    source: parentId,
                    target: nodeId,
                    type: 'default',
                    animated: false,
                });
            }
        }

        activeParents[level] = nodeId;

        // Clear active parents at deeper levels
        for (let l = level + 1; l <= 20; l++) {
            delete activeParents[l];
        }
    });

    // Determine hasChildren flag for all nodes
    const parentIds = new Set(edges.map(e => e.source));
    nodes.forEach(n => {
        n.data = {
            ...n.data,
            hasChildren: parentIds.has(n.id)
        };
    });

    const positionedNodes = layoutNodes(nodes, edges);
    return updateVisibility(positionedNodes, edges);
};

export const useMapaMental = (active = true) => {
    const [markdown, setMarkdown] = useState<string>(INITIAL_MARKDOWN);
    const [isMdPanelOpen, setIsMdPanelOpen] = useState(true);

    const initialFlow = useMemo(() => {
        return parseMarkdownToFlow(INITIAL_MARKDOWN);
    }, []);

    const [nodes, setNodes] = useState<Node[]>(initialFlow.nodes);
    const [edges, setEdges] = useState<Edge[]>(initialFlow.edges);

    const { undo: undoNodes, redo: redoNodes } = useHistory(nodes, setNodes);
    const { undo: undoEdges, redo: redoEdges } = useHistory(edges, setEdges);

    const undo = useCallback(() => { undoNodes(); undoEdges(); }, [undoNodes, undoEdges]);
    const redo = useCallback(() => { redoNodes(); redoEdges(); }, [redoNodes, redoEdges]);

    useEffect(() => {
        if (!active) return;
        const handler = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;
            if (
                target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA' ||
                target.isContentEditable
            ) {
                return;
            }
            if (!(e.ctrlKey || e.metaKey)) return;
            if (e.key === 'z') { e.preventDefault(); undo(); }
            if (e.key === 'y') { e.preventDefault(); redo(); }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [undo, redo, active]);

    const { screenToFlowPosition } = useReactFlow();

    // Helper to generate MD from current nodes/edges and update state
    const syncMarkdownFromFlow = useCallback((currentNodes: Node[], currentEdges: Edge[]) => {
        const tree = buildTree(currentNodes, currentEdges);
        const md = treeToMarkdown(tree);
        setMarkdown(md);
    }, []);

    const onNodesChange = useCallback(
        (changes: NodeChange[]) => {
            setNodes((nds) => {
                const nextNodes = applyNodeChanges(changes, nds);
                return nextNodes;
            });
        },
        []
    );

    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => {
            setEdges((eds) => {
                const nextEdges = applyEdgeChanges(changes, eds);
                return nextEdges;
            });
        },
        []
    );

    const onConnect = useCallback((params: Connection) => {
        setEdges((eds) => {
            const nextEdges = addEdge({ ...params, type: 'default', animated: false }, eds);

            // Re-render layout and update Markdown
            setNodes((nds) => {
                const parentIds = new Set(nextEdges.map(e => e.source));
                const updatedNds = nds.map(n => ({
                    ...n,
                    data: { ...n.data, hasChildren: parentIds.has(n.id) }
                }));
                const positioned = layoutNodes(updatedNds, nextEdges);
                const { nodes: visibleNodes } = updateVisibility(positioned, nextEdges);

                // Sync markdown state
                setTimeout(() => syncMarkdownFromFlow(visibleNodes, nextEdges), 0);
                return visibleNodes;
            });

            return nextEdges;
        });
    }, [syncMarkdownFromFlow]);

    const onEdgesDelete = useCallback((edgesToDelete: Edge[]) => {
        setEdges((eds) => {
            const nextEdges = eds.filter((e) => !edgesToDelete.find((del) => del.id === e.id));

            // Recalculate children flags, layout and markdown
            setNodes((nds) => {
                const parentIds = new Set(nextEdges.map(e => e.source));
                const updatedNds = nds.map(n => ({
                    ...n,
                    data: { ...n.data, hasChildren: parentIds.has(n.id) }
                }));
                const positioned = layoutNodes(updatedNds, nextEdges);
                const { nodes: visibleNodes } = updateVisibility(positioned, nextEdges);
                setTimeout(() => syncMarkdownFromFlow(visibleNodes, nextEdges), 0);
                return visibleNodes;
            });

            return nextEdges;
        });
    }, [syncMarkdownFromFlow]);

    const onConnectEnd = useCallback((event: any, connectionState: any) => {
        if (!connectionState.isValid) {
            const { clientX, clientY } = 'changedTouches' in event ? event.changedTouches[0] : event;
            const position = screenToFlowPosition({ x: clientX, y: clientY });

            const nextId = `n-${Date.now()}`;
            const newEdge = {
                id: `e-${connectionState.fromNode.id}-${nextId}`,
                source: connectionState.fromNode.id,
                target: nextId,
                type: 'default',
                animated: false
            };

            setEdges((eds) => {
                const nextEdges = [...eds, newEdge];

                setNodes((nds) => {
                    const newNode: Node = {
                        id: nextId,
                        position,
                        type: 'nodeMapaMental',
                        data: {
                            label: `Nuevo Nodo`,
                            status: 'PENDIENTE',
                            statusDetail: '',
                            collapsed: false,
                        }
                    };

                    const parentIds = new Set(nextEdges.map(e => e.source));
                    const updatedNds = [...nds, newNode].map(n => ({
                        ...n,
                        data: { ...n.data, hasChildren: parentIds.has(n.id) }
                    }));

                    const positioned = layoutNodes(updatedNds, nextEdges);
                    const { nodes: visibleNodes } = updateVisibility(positioned, nextEdges);
                    setTimeout(() => syncMarkdownFromFlow(visibleNodes, nextEdges), 0);
                    return visibleNodes;
                });

                return nextEdges;
            });
        }
    }, [screenToFlowPosition, syncMarkdownFromFlow]);

    // Handlers called by the custom NodeMapaMental

    const onStatusChange = useCallback((id: string, newStatus: 'PENDIENTE' | 'EN PROCESO' | 'TERMINADO') => {
        setNodes((nds) => {
            const updated = nds.map((n) => {
                if (n.id === id) {
                    return {
                        ...n,
                        data: {
                            ...n.data,
                            status: newStatus
                        }
                    };
                }
                return n;
            });
            // Sync markdown state
            syncMarkdownFromFlow(updated, edges);
            return updated;
        });
    }, [edges, syncMarkdownFromFlow]);

    const onDeleteNode = useCallback((id: string) => {
        // Collect descendants to delete recursively
        const collectDescendants = (nodeId: string, currentEdges: Edge[], acc: Set<string>) => {
            currentEdges.forEach(e => {
                if (e.source === nodeId && !acc.has(e.target)) {
                    acc.add(e.target);
                    collectDescendants(e.target, currentEdges, acc);
                }
            });
        };

        const toDelete = new Set<string>([id]);
        collectDescendants(id, edges, toDelete);

        setNodes((nds) => {
            const nextNodes = nds.filter(n => !toDelete.has(n.id));

            setEdges((eds) => {
                const nextEdges = eds.filter(e => !toDelete.has(e.source) && !toDelete.has(e.target));

                // Update parents hasChildren flag
                const parentIds = new Set(nextEdges.map(e => e.source));
                const updatedNds = nextNodes.map(n => ({
                    ...n,
                    data: {
                        ...n.data,
                        hasChildren: parentIds.has(n.id)
                    }
                }));

                const positioned = layoutNodes(updatedNds, nextEdges);
                const { nodes: visibleNodes } = updateVisibility(positioned, nextEdges);

                setTimeout(() => syncMarkdownFromFlow(visibleNodes, nextEdges), 0);
                return nextEdges;
            });

            return nextNodes;
        });
    }, [edges, syncMarkdownFromFlow]);

    const onToggleCollapse = useCallback((id: string) => {
        setNodes((nds) => {
            const updated = nds.map(n => {
                if (n.id === id) {
                    return {
                        ...n,
                        data: {
                            ...n.data,
                            collapsed: !n.data.collapsed
                        }
                    };
                }
                return n;
            });

            const positioned = layoutNodes(updated, edges);
            const { nodes: visibleNodes, edges: visibleEdges } = updateVisibility(positioned, edges);
            setEdges(visibleEdges);
            return visibleNodes;
        });
    }, [edges]);

    const onLabelChange = useCallback((id: string, newLabel: string) => {
        setNodes((nds) => {
            const updated = nds.map(n => {
                if (n.id === id) {
                    return {
                        ...n,
                        data: {
                            ...n.data,
                            label: newLabel
                        }
                    };
                }
                return n;
            });
            syncMarkdownFromFlow(updated, edges);
            return updated;
        });
    }, [edges, syncMarkdownFromFlow]);

    // Toggle all: abre y cierra todos los nodos
    const onToggleAll = useCallback(() => {
        const isAny = nodes.some(n => n.data?.collapsed === true);

        setNodes((nds) => {
            const updated = nds.map(n => {
                return {
                    ...n,
                    data: {
                        ...n.data,
                        collapsed: !isAny
                    }
                };
            });

            const positioned = layoutNodes(updated, edges);
            const { nodes: visibleNodes, edges: visibleEdges } = updateVisibility(positioned, edges);
            setEdges(visibleEdges);
            return visibleNodes;
        });
    }, [nodes, edges]);

    const isAnyCollapsed = useMemo(() => {
        return nodes.some(n => n.data?.collapsed === true);
    }, [nodes]);

    // Update diagram structure when user types in the MD editor
    const updateFromMarkdown = useCallback((newMarkdown: string) => {
        setMarkdown(newMarkdown);
        try {
            const parsed = parseMarkdownToFlow(newMarkdown);
            setNodes(parsed.nodes);
            setEdges(parsed.edges);
        } catch (e) {
            console.error('Error parsing markdown', e);
        }
    }, []);

    // Create a new root node
    const onAddNode = useCallback(() => {
        setMarkdown((prev) => {
            const next = prev.trim() + '\n\n# NUEVO NODO';
            // Trigger flow update
            setTimeout(() => {
                const parsed = parseMarkdownToFlow(next);
                setNodes(parsed.nodes);
                setEdges(parsed.edges);
            }, 0);
            return next;
        });
    }, []);

    // Helper to expose node methods inside React Flow components
    const nodeHandlers = useMemo(() => ({
        onStatusChange,
        onDeleteNode,
        onToggleCollapse,
        onLabelChange
    }), [onStatusChange, onDeleteNode, onToggleCollapse, onLabelChange]);

    // Inject handlers into node data before returning
    const nodesWithHandlers = useMemo(() => {
        return nodes.map(n => ({
            ...n,
            data: {
                ...n.data,
                ...nodeHandlers
            }
        }));
    }, [nodes, nodeHandlers]);

    return {
        nodes: nodesWithHandlers,
        edges,
        markdown,
        isMdPanelOpen,
        setIsMdPanelOpen,
        onNodesChange,
        onEdgesChange,
        onConnect,
        onEdgesDelete,
        onConnectEnd,
        onStatusChange,
        onDeleteNode,
        onToggleCollapse,
        onCloseAll: onToggleAll,
        isAnyCollapsed,
        updateFromMarkdown,
        onAddNode,
        undo,
        redo
    };
};
