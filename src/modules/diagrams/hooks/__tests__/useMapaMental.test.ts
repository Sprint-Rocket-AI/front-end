import { describe, it, expect } from "vitest";
import {
  parseStatusFromLabel,
  parseMarkdownToFlow,
  layoutNodes,
  updateVisibility,
} from "../useMapaMental";
import type { Node, Edge } from "@xyflow/react";

describe("useMapaMental utilities", () => {
  describe("parseStatusFromLabel", () => {
    it("should parse TERMINADO status from label with (OK) suffix", () => {
      const res = parseStatusFromLabel("Diseñar login (OK)");
      expect(res).toEqual({
        status: "TERMINADO",
        statusDetail: "",
        cleanLabel: "Diseñar login",
      });
    });

    it("should parse EN PROCESO status from label with (EN DESARROLLO) suffix", () => {
      const res = parseStatusFromLabel("Crear API (EN DESARROLLO)");
      expect(res).toEqual({
        status: "EN PROCESO",
        statusDetail: "",
        cleanLabel: "Crear API",
      });
    });

    it("should parse EN PROCESO status and detail from label with sub-details", () => {
      const res = parseStatusFromLabel("Configurar BD (EN PROCESO - Postgres)");
      expect(res).toEqual({
        status: "EN PROCESO",
        statusDetail: " - Postgres",
        cleanLabel: "Configurar BD",
      });
    });

    it("should default to PENDIENTE status when no matches are found", () => {
      const res = parseStatusFromLabel("Definir requerimientos");
      expect(res).toEqual({
        status: "PENDIENTE",
        statusDetail: "",
        cleanLabel: "Definir requerimientos",
      });
    });
  });

  describe("layoutNodes", () => {
    it("should compute positions based on level hierarchy", () => {
      const nodes: Node[] = [
        { id: "root", position: { x: 0, y: 0 }, data: { label: "Root" } },
        { id: "c1", position: { x: 0, y: 0 }, data: { label: "C1" } },
      ];
      const edges: Edge[] = [
        { id: "e1", source: "root", target: "c1" },
      ];

      const positioned = layoutNodes(nodes, edges);

      const rootNode = positioned.find(n => n.id === "root");
      const childNode = positioned.find(n => n.id === "c1");

      // Root level 1 -> X = 0
      expect(rootNode?.position.x).toBe(0);
      // Child level 2 -> X = 320
      expect(childNode?.position.x).toBe(320);
      // Nodes should have been spaced vertically
      expect(rootNode?.position.y).toBeDefined();
      expect(childNode?.position.y).toBeDefined();
    });
  });

  describe("updateVisibility", () => {
    it("should hide child nodes and edges if the parent node is collapsed", () => {
      const nodes: Node[] = [
        { id: "root", position: { x: 0, y: 0 }, data: { label: "Root", collapsed: true } },
        { id: "c1", position: { x: 0, y: 0 }, data: { label: "C1" } },
      ];
      const edges: Edge[] = [
        { id: "e1", source: "root", target: "c1" },
      ];

      const { nodes: updatedNodes, edges: updatedEdges } = updateVisibility(nodes, edges);

      const childNode = updatedNodes.find(n => n.id === "c1");
      const edge = updatedEdges.find(e => e.id === "e1");

      expect(childNode?.hidden).toBe(true);
      expect(edge?.hidden).toBe(true);
    });

    it("should keep child nodes and edges visible if the parent is not collapsed", () => {
      const nodes: Node[] = [
        { id: "root", position: { x: 0, y: 0 }, data: { label: "Root", collapsed: false } },
        { id: "c1", position: { x: 0, y: 0 }, data: { label: "C1" } },
      ];
      const edges: Edge[] = [
        { id: "e1", source: "root", target: "c1" },
      ];

      const { nodes: updatedNodes, edges: updatedEdges } = updateVisibility(nodes, edges);

      const childNode = updatedNodes.find(n => n.id === "c1");
      const edge = updatedEdges.find(e => e.id === "e1");

      expect(childNode?.hidden).toBe(false);
      expect(edge?.hidden).toBe(false);
    });
  });

  describe("parseMarkdownToFlow", () => {
    it("should parse simple markdown hierarchy into flow nodes and edges", () => {
      const md = `
# Idea principal
## Subtema 1 (EN DESARROLLO)
### Detalle 1.1 (OK)
      `;

      const { nodes, edges } = parseMarkdownToFlow(md);

      // Should parse 3 nodes
      expect(nodes).toHaveLength(3);
      // Should parse 2 edges
      expect(edges).toHaveLength(2);

      // Verify node values
      const root = nodes.find(n => n.data.label === "Idea principal");
      const sub = nodes.find(n => n.data.label === "Subtema 1");
      const det = nodes.find(n => n.data.label === "Detalle 1.1");

      expect(root?.data.status).toBe("PENDIENTE");
      expect(sub?.data.status).toBe("EN PROCESO");
      expect(det?.data.status).toBe("TERMINADO");

      // Verify connections
      expect(edges[0].source).toBe(root?.id);
      expect(edges[0].target).toBe(sub?.id);

      expect(edges[1].source).toBe(sub?.id);
      expect(edges[1].target).toBe(det?.id);
    });
  });
});
