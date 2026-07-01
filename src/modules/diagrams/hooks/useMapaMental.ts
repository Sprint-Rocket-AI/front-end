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
    type Node,
    type FinalConnectionState
} from '@xyflow/react';
import { useHistory } from './useHistory';
import { useNodeDragHistory } from './useNodeDragHistory';

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

interface TreeNode {
    id: string;
    label: string;
    status: 'PENDIENTE' | 'EN PROCESO' | 'TERMINADO';
    statusDetail?: string;
    collapsed?: boolean;
    children: TreeNode[];
    level: number;
}

const buildTree = (nodes: Node[], edges: Edge[]): TreeNode[] => {
    const parentMap = new Map<string, string>();
    edges.forEach(e => {
        parentMap.set(e.target, e.source);
    });

    const nodeMap = new Map<string, Node>();
    nodes.forEach(n => nodeMap.set(n.id, n));

    const childrenMap = new Map<string, string[]>();
    edges.forEach(e => {
        if (!childrenMap.has(e.source)) {
            childrenMap.set(e.source, []);
        }
        childrenMap.get(e.source)!.push(e.target);
    });

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
        if (idx > 0) lines.push('');
        stringifyNode(root);
    });

    return lines.join('\n');
};

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

        const x = (level - 1) * 320;

        if (children.length === 0 || isCollapsed) {
            const y = currentY;
            currentY += 110;
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

        let y: number;
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
        currentY += 60;
    });

    return nodes.map(node => {
        const pos = positions.get(node.id) || { x: 0, y: 0 };
        return {
            ...node,
            position: pos
        };
    });
};

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

        for (let l = level + 1; l <= 20; l++) {
            delete activeParents[l];
        }
    });

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

export const useMapaMental = (active = true, initialMarkdown?: string) => {
    const [prevMarkdownProp, setPrevMarkdownProp] = useState<string | undefined>(initialMarkdown);
    const [markdown, setMarkdown] = useState<string>(initialMarkdown || '');
    const [isMdPanelOpen, setIsMdPanelOpen] = useState(true);

    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);

    if (active && prevMarkdownProp !== initialMarkdown) {
        setPrevMarkdownProp(initialMarkdown);
        setMarkdown(initialMarkdown || '');
        try {
            const parsed = parseMarkdownToFlow(initialMarkdown || '');
            setNodes(parsed.nodes);
            setEdges(parsed.edges);
        } catch (e) {
            console.error('Error parsing markdown on load', e);
        }
    }

    const { push: pushHistory, undo, redo, canUndo, canRedo } = useHistory(
        { nodes, edges },
        (newState) => {
            setNodes(newState.nodes);
            setEdges(newState.edges);
        }
    );

    const { onNodeDragStart, onNodeDragStop } = useNodeDragHistory({
        getSnapshot: () => ({ nodes, edges }),
        pushHistory
    });

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
        const nextEdges = addEdge({ ...params, type: 'default', animated: false }, edges);
        
        const parentIds = new Set(nextEdges.map(e => e.source));
        const updatedNds = nodes.map(n => ({
            ...n,
            data: { ...n.data, hasChildren: parentIds.has(n.id) }
        }));
        const positioned = layoutNodes(updatedNds, nextEdges);
        const { nodes: visibleNodes } = updateVisibility(positioned, nextEdges);
        
        pushHistory({ nodes: visibleNodes, edges: nextEdges });
        syncMarkdownFromFlow(visibleNodes, nextEdges);
    }, [nodes, edges, pushHistory, syncMarkdownFromFlow]);

    const onEdgesDelete = useCallback((edgesToDelete: Edge[]) => {
        const nextEdges = edges.filter((e) => !edgesToDelete.find((del) => del.id === e.id));

        const parentIds = new Set(nextEdges.map(e => e.source));
        const updatedNds = nodes.map(n => ({
            ...n,
            data: { ...n.data, hasChildren: parentIds.has(n.id) }
        }));
        const positioned = layoutNodes(updatedNds, nextEdges);
        const { nodes: visibleNodes } = updateVisibility(positioned, nextEdges);
        
        pushHistory({ nodes: visibleNodes, edges: nextEdges });
        syncMarkdownFromFlow(visibleNodes, nextEdges);
    }, [nodes, edges, pushHistory, syncMarkdownFromFlow]);

    const onConnectEnd = useCallback((event: MouseEvent | TouchEvent, connectionState: FinalConnectionState) => {
        const fromNode = connectionState.fromNode;

        if (!connectionState.isValid && fromNode) {
            const touchEvent = event as TouchEvent;
            const mouseEvent = event as MouseEvent;
            const clientX = 'changedTouches' in event ? touchEvent.changedTouches[0].clientX : mouseEvent.clientX;
            const clientY = 'changedTouches' in event ? touchEvent.changedTouches[0].clientY : mouseEvent.clientY;
            const sourceNode = nodes.find((node) => node.id === fromNode.id);
            const position = sourceNode
                ? { x: sourceNode.position.x + 320, y: sourceNode.position.y }
                : screenToFlowPosition({ x: clientX, y: clientY });

            const nextId = `n-${Date.now()}`;
            const newEdge = {
                id: `e-${fromNode.id}-${nextId}`,
                source: fromNode.id,
                target: nextId,
                type: 'default',
                animated: false
            };

            const nextEdges = [...edges, newEdge];
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
            const updatedNds = [...nodes, newNode].map(n => ({
                ...n,
                data: { ...n.data, hasChildren: parentIds.has(n.id) }
            }));

            const { nodes: visibleNodes } = updateVisibility(updatedNds, nextEdges);
            
            pushHistory({ nodes: visibleNodes, edges: nextEdges });
            syncMarkdownFromFlow(visibleNodes, nextEdges);
        }
    }, [screenToFlowPosition, nodes, edges, pushHistory, syncMarkdownFromFlow]);

    const onStatusChange = useCallback((id: string, newStatus: 'PENDIENTE' | 'EN PROCESO' | 'TERMINADO') => {
        const updated = nodes.map((n) => {
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
        
        pushHistory({ nodes: updated, edges });
        syncMarkdownFromFlow(updated, edges);
    }, [nodes, edges, pushHistory, syncMarkdownFromFlow]);

    const onDeleteNode = useCallback((id: string) => {
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

        const nextNodes = nodes.filter(n => !toDelete.has(n.id));
        const nextEdges = edges.filter(e => !toDelete.has(e.source) && !toDelete.has(e.target));

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

        pushHistory({ nodes: visibleNodes, edges: nextEdges });
        syncMarkdownFromFlow(visibleNodes, nextEdges);
    }, [nodes, edges, pushHistory, syncMarkdownFromFlow]);

    const onToggleCollapse = useCallback((id: string) => {
        const updated = nodes.map(n => {
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
        
        pushHistory({ nodes: visibleNodes, edges: visibleEdges });
    }, [nodes, edges, pushHistory]);

    const onLabelChange = useCallback((id: string, newLabel: string) => {
        const updated = nodes.map(n => {
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
        
        pushHistory({ nodes: updated, edges });
        syncMarkdownFromFlow(updated, edges);
    }, [nodes, edges, pushHistory, syncMarkdownFromFlow]);

    const onToggleAll = useCallback(() => {
        const isAny = nodes.some(n => n.data?.collapsed === true);

        const updated = nodes.map(n => {
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
        
        pushHistory({ nodes: visibleNodes, edges: visibleEdges });
    }, [nodes, edges, pushHistory]);

    const isAnyCollapsed = useMemo(() => {
        return nodes.some(n => n.data?.collapsed === true);
    }, [nodes]);

    const updateFromMarkdown = useCallback((newMarkdown: string) => {
        setMarkdown(newMarkdown);
        try {
            const parsed = parseMarkdownToFlow(newMarkdown);
            pushHistory({ nodes: parsed.nodes, edges: parsed.edges });
        } catch (e) {
            console.error('Error parsing markdown', e);
        }
    }, [pushHistory]);

    const onAddNode = useCallback(() => {
        setMarkdown((prev) => {
            const next = prev.trim() + '\n\n# NUEVO NODO';
            setTimeout(() => {
                const parsed = parseMarkdownToFlow(next);
                setNodes(parsed.nodes);
                setEdges(parsed.edges);
            }, 0);
            return next;
        });
    }, []);

    const nodeHandlers = useMemo(() => ({
        onStatusChange,
        onDeleteNode,
        onToggleCollapse,
        onLabelChange
    }), [onStatusChange, onDeleteNode, onToggleCollapse, onLabelChange]);

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
        onNodeDragStart,
        onNodeDragStop,
        updateFromMarkdown,
        onAddNode,
        undo,
        redo,
        canUndo,
        canRedo
    };
};
