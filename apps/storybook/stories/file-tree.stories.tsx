import {
  FileTree,
  type FileTreeNode,
} from "@repo/design-system/components/file-tree";
import type { Meta, StoryObj } from "@storybook/react";
import { useCallback, useState } from "react";

const seed: FileTreeNode[] = [
  {
    id: "src",
    name: "src",
    type: "folder",
    children: [
      { id: "main", name: "main.ts", type: "file" },
      {
        id: "lib",
        name: "lib",
        type: "folder",
        children: [{ id: "utils", name: "utils.ts", type: "file" }],
      },
    ],
  },
  { id: "readme", name: "README.md", type: "file" },
];

function InteractiveFileTree() {
  const [data, setData] = useState<FileTreeNode[]>(seed);
  const [selectedId, setSelectedId] = useState<string | null>("main");

  const findAndRemove = useCallback(
    (nodes: FileTreeNode[], id: string): FileTreeNode[] | null => {
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        if (!n) continue;
        if (n.id === id) {
          const copy = [...nodes];
          copy.splice(i, 1);
          return copy;
        }
        if (n.type === "folder" && n.children) {
          const nextChildren = findAndRemove(n.children, id);
          if (nextChildren) {
            const copy = [...nodes];
            copy[i] = { ...n, children: nextChildren };
            return copy;
          }
        }
      }
      return null;
    },
    []
  );

  const insertChild = useCallback(
    (
      nodes: FileTreeNode[],
      parentId: string | null,
      node: FileTreeNode
    ): FileTreeNode[] => {
      if (parentId === null) {
        return [...nodes, node];
      }
      return nodes.map((n) => {
        if (n.id === parentId && n.type === "folder") {
          return {
            ...n,
            children: [...(n.children ?? []), node],
          };
        }
        if (n.type === "folder") {
          return {
            ...n,
            children: insertChild(n.children ?? [], parentId, node),
          };
        }
        return n;
      });
    },
    []
  );

  const renameInTree = useCallback(
    (nodes: FileTreeNode[], nodeId: string, newName: string): FileTreeNode[] =>
      nodes.map((n) => {
        if (n.id === nodeId) return { ...n, name: newName };
        if (n.type === "folder" && n.children?.length) {
          return { ...n, children: renameInTree(n.children, nodeId, newName) };
        }
        return n;
      }),
    []
  );

  return (
    <div className="w-72 rounded-md border bg-background">
      <FileTree
        data={data}
        onNodeCreate={(parentId, name, type) => {
          const id = `${type}-${Date.now()}`;
          const created: FileTreeNode =
            type === "folder"
              ? { id, name, type: "folder", children: [] }
              : { id, name, type: "file" };
          setData((d) => insertChild(d, parentId, created));
        }}
        onNodeDelete={(nodeId) => {
          setData((d) => findAndRemove(d, nodeId) ?? d);
          setSelectedId((s) => (s === nodeId ? null : s));
        }}
        onNodeRename={(nodeId, newName) => {
          setData((d) => renameInTree(d, nodeId, newName));
        }}
        onNodeSelect={(n) => setSelectedId(n.id)}
        selectedNodeId={selectedId}
      />
    </div>
  );
}

const meta = {
  title: "patterns/FileTree",
  component: FileTree,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: {
    data: seed,
  },
} satisfies Meta<typeof FileTree>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <InteractiveFileTree />,
};

export const ReadOnly: Story = {
  render: () => (
    <div className="w-72 rounded-md border bg-background">
      <FileTree data={seed} selectedNodeId="lib" />
    </div>
  ),
};
