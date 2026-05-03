"use client";

import { Card, CardContent } from "@repo/design-system/components/ui/card";
import { Separator } from "@repo/design-system/components/ui/separator";
import { cn } from "@repo/design-system/lib/utils";
import { nanoid } from "nanoid";
import { useState } from "react";

import { FileTree, type FileTreeNode } from "./file-tree";

const demoInitialData: FileTreeNode[] = [
  {
    id: "1",
    name: "src",
    type: "folder",
    children: [
      {
        id: "2",
        name: "components",
        type: "folder",
        parentId: "1",
        children: [
          {
            id: "3",
            name: "ui",
            type: "folder",
            parentId: "2",
            children: [
              { id: "4", name: "button.tsx", type: "file", parentId: "3" },
              { id: "5", name: "input.tsx", type: "file", parentId: "3" },
              { id: "6", name: "card.tsx", type: "file", parentId: "3" },
            ],
          },
          { id: "7", name: "header.tsx", type: "file", parentId: "2" },
          { id: "8", name: "footer.tsx", type: "file", parentId: "2" },
        ],
      },
      {
        id: "9",
        name: "pages",
        type: "folder",
        parentId: "1",
        children: [
          { id: "10", name: "index.tsx", type: "file", parentId: "9" },
          { id: "11", name: "about.tsx", type: "file", parentId: "9" },
        ],
      },
      { id: "12", name: "app.tsx", type: "file", parentId: "1" },
      { id: "13", name: "main.tsx", type: "file", parentId: "1" },
    ],
  },
  {
    id: "14",
    name: "public",
    type: "folder",
    children: [
      { id: "15", name: "favicon.ico", type: "file", parentId: "14" },
      { id: "16", name: "logo.svg", type: "file", parentId: "14" },
    ],
  },
  { id: "17", name: "package.json", type: "file" },
  { id: "18", name: "README.md", type: "file" },
  { id: "19", name: "tsconfig.json", type: "file" },
];

const sortTreeNodes = (nodes: FileTreeNode[]): FileTreeNode[] =>
  [...nodes].sort((a, b) => {
    if (a.type === "folder" && b.type === "file") {
      return -1;
    }
    if (a.type === "file" && b.type === "folder") {
      return 1;
    }
    return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
  });

const applySortingToTree = (nodes: FileTreeNode[]): FileTreeNode[] =>
  sortTreeNodes(
    nodes.map((node) => ({
      ...node,
      children: node.children ? applySortingToTree(node.children) : undefined,
    }))
  );

function removeNodeById(nodes: FileTreeNode[], id: string): FileTreeNode[] {
  return nodes.flatMap((node) => {
    if (node.id === id) {
      return [];
    }
    if (node.type === "folder" && node.children) {
      return [{ ...node, children: removeNodeById(node.children, id) }];
    }
    return [node];
  });
}

export type FileTreeDemoProps = {
  className?: string;
  /** Override the initial tree (still pre-sorted the same way as the built-in sample). */
  initialData?: FileTreeNode[];
};

export function FileTreeDemo({
  className,
  initialData = demoInitialData,
}: FileTreeDemoProps) {
  const [treeData, setTreeData] = useState<FileTreeNode[]>(() =>
    applySortingToTree(initialData)
  );
  const [selectedFile, setSelectedFile] = useState<FileTreeNode | null>(null);

  const handleNodeSelect = (node: FileTreeNode) => {
    setSelectedFile(node);
  };

  const handleNodeCreate = (
    parentId: string | null,
    name: string,
    type: "file" | "folder"
  ) => {
    const newNode: FileTreeNode = {
      id: nanoid(),
      name,
      type,
      parentId: parentId ?? undefined,
      children: type === "folder" ? [] : undefined,
    };

    setSelectedFile(newNode);

    setTreeData((prevData) => {
      if (!parentId) {
        return sortTreeNodes([...prevData, newNode]);
      }

      const addToParent = (nodes: FileTreeNode[]): FileTreeNode[] =>
        nodes.map((node) => {
          if (node.id === parentId) {
            const updatedChildren = [...(node.children ?? []), newNode];
            return {
              ...node,
              children: sortTreeNodes(updatedChildren),
            };
          }
          if (node.children) {
            return {
              ...node,
              children: addToParent(node.children),
            };
          }
          return node;
        });

      return addToParent(prevData);
    });
  };

  const handleNodeRename = (nodeId: string, newName: string) => {
    setTreeData((prevData) => {
      const renameNode = (nodes: FileTreeNode[]): FileTreeNode[] =>
        nodes.map((node) => {
          if (node.id === nodeId) {
            return { ...node, name: newName };
          }
          if (node.children) {
            return {
              ...node,
              children: renameNode(node.children),
            };
          }
          return node;
        });

      const renamedData = renameNode(prevData);

      const reSortTree = (nodes: FileTreeNode[]): FileTreeNode[] =>
        sortTreeNodes(
          nodes.map((node) => ({
            ...node,
            children: node.children ? reSortTree(node.children) : undefined,
          }))
        );

      return reSortTree(renamedData);
    });

    setSelectedFile((prev) => {
      if (prev?.id === nodeId) {
        return { ...prev, name: newName };
      }
      return prev;
    });
  };

  const handleNodeDelete = (nodeId: string) => {
    setTreeData((prevData) => removeNodeById(prevData, nodeId));

    setSelectedFile((prev) => {
      if (prev?.id === nodeId) {
        return null;
      }
      return prev;
    });
  };

  return (
    <div className={cn("mx-auto w-full max-w-6xl p-6", className)}>
      <div className="mb-6">
        <h1 className="font-bold text-3xl">File Tree Component</h1>
        <p className="mt-2 text-muted-foreground">
          A VS Code-style file tree with context menus, create, rename, and
          delete functionality.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="gap-0 overflow-hidden py-0 lg:col-span-1">
          <FileTree
            data={treeData}
            onNodeCreate={handleNodeCreate}
            onNodeDelete={handleNodeDelete}
            onNodeRename={handleNodeRename}
            onNodeSelect={handleNodeSelect}
            selectedNodeId={selectedFile?.id ?? null}
          />
        </Card>

        <Card className="lg:col-span-2">
          <CardContent className="space-y-4 p-6">
            <h3 className="font-semibold text-lg">File Details</h3>
            <Separator />
            {selectedFile ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">Name:</span>
                  <span className="text-sm">{selectedFile.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">Type:</span>
                  <span className="text-sm capitalize">
                    {selectedFile.type}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">ID:</span>
                  <span className="font-mono text-muted-foreground text-sm">
                    {selectedFile.id}
                  </span>
                </div>
                {selectedFile.parentId ? (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">Parent ID:</span>
                    <span className="font-mono text-muted-foreground text-sm">
                      {selectedFile.parentId}
                    </span>
                  </div>
                ) : null}
                {selectedFile.type === "folder" ? (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">Children:</span>
                    <span className="text-sm">
                      {selectedFile.children?.length ?? 0} items
                    </span>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <p>Select a file or folder to view details</p>
                <p className="mt-2 text-sm">
                  Right-click items for context menu options
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardContent className="space-y-2 p-6 text-muted-foreground text-sm">
          <h3 className="mb-3 font-semibold text-foreground text-lg">
            How to Use
          </h3>
          <p>
            <strong className="text-foreground">Click</strong> on folders to
            expand/collapse them
          </p>
          <p>
            <strong className="text-foreground">Click</strong> on files or
            folders to select them
          </p>
          <p>
            <strong className="text-foreground">Hover</strong> over folders to
            see creation icons (file and folder)
          </p>
          <p>
            <strong className="text-foreground">Click creation icons</strong> or
            use header buttons to create new items inline
          </p>
          <p>
            <strong className="text-foreground">Right-click</strong> on any item
            to open the context menu
          </p>
          <p>
            <strong className="text-foreground">Context menu options:</strong>{" "}
            Create new files/folders (folders only), Rename, Delete
          </p>
          <p>
            Press <strong className="text-foreground">Enter</strong> to confirm
            or <strong className="text-foreground">Escape</strong> to cancel
            inline actions
          </p>
          <p>
            <strong className="text-foreground">Inline editing:</strong> All
            creation and renaming happens directly in the tree
          </p>
          <p>
            <strong className="text-foreground">Auto-sorting:</strong> Folders
            appear first, then files, all sorted alphabetically
          </p>
          <p>
            <strong className="text-foreground">Smart insertion:</strong> New
            items are automatically placed in the correct sorted position
          </p>
          <p>
            <strong className="text-foreground">Auto-selection:</strong> Newly
            created files and folders are automatically selected with enhanced
            visual highlighting
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
