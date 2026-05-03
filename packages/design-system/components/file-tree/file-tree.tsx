"use client";

import { Button } from "@repo/design-system/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@repo/design-system/components/ui/collapsible";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@repo/design-system/components/ui/context-menu";
import { Input } from "@repo/design-system/components/ui/input";
import { cn } from "@repo/design-system/lib/utils";
import {
  Check,
  ChevronDown,
  ChevronRight,
  Edit,
  File,
  FileText,
  Folder,
  FolderOpen,
  FolderPlus,
  Trash2,
  X,
} from "lucide-react";
import {
  type Dispatch,
  type KeyboardEvent,
  type RefObject,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";

export type FileTreeNode = {
  id: string;
  name: string;
  type: "file" | "folder";
  children?: FileTreeNode[];
  parentId?: string;
};

type FileTreeProps = {
  data: FileTreeNode[];
  selectedNodeId?: string | null;
  onNodeSelect?: (node: FileTreeNode) => void;
  onNodeCreate?: (
    parentId: string | null,
    name: string,
    type: "file" | "folder"
  ) => void;
  onNodeRename?: (nodeId: string, newName: string) => void;
  onNodeDelete?: (nodeId: string) => void;
};

type InlineInputState = {
  folderId: string | null;
  type: "file" | "folder" | null;
  value: string;
};

type RenameState = {
  nodeId: string | null;
  value: string;
};

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

function folderDisclosureIcon(showDisclosure: boolean, isExpanded: boolean) {
  if (!showDisclosure) {
    return <div className="h-3 w-3" />;
  }
  if (isExpanded) {
    return <ChevronDown className="h-3 w-3" />;
  }
  return <ChevronRight className="h-3 w-3" />;
}

type FileTreeRowProps = {
  node: FileTreeNode;
  depth: number;
  isExpanded: boolean;
  isSelected: boolean;
  hasChildren: boolean;
  isHovered: boolean;
  isRenaming: boolean;
  inlineFolderId: string | null;
  renameState: RenameState;
  renameInputRef: RefObject<HTMLInputElement | null>;
  onRowClick: (node: FileTreeNode) => void;
  onRowKeyDown: (e: KeyboardEvent<HTMLDivElement>, node: FileTreeNode) => void;
  onFolderMouseEnter: (id: string) => void;
  onFolderMouseLeave: () => void;
  startInlineCreate: (folderId: string | null, type: "file" | "folder") => void;
  startRename: (nodeId: string, name: string) => void;
  handleDelete: (nodeId: string) => void;
  setRenameState: Dispatch<SetStateAction<RenameState>>;
  confirmRename: () => void;
  cancelRename: () => void;
};

function FileTreeRow({
  node,
  depth,
  isExpanded,
  isSelected,
  hasChildren,
  isHovered,
  isRenaming,
  inlineFolderId,
  renameState,
  renameInputRef,
  onRowClick,
  onRowKeyDown,
  onFolderMouseEnter,
  onFolderMouseLeave,
  startInlineCreate,
  startRename,
  handleDelete,
  setRenameState,
  confirmRename,
  cancelRename,
}: FileTreeRowProps) {
  const showDisclosure = Boolean(hasChildren || inlineFolderId === node.id);

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          className={cn(
            "group flex cursor-pointer items-center gap-1 rounded-sm px-2 py-1 text-sm hover:bg-accent hover:text-accent-foreground",
            isSelected
              ? "border-primary border-l-2 bg-primary/10 text-primary"
              : "hover:bg-accent hover:text-accent-foreground",
            "relative select-none transition-colors duration-150"
          )}
          onClick={() => {
            if (!isRenaming) {
              onRowClick(node);
            }
          }}
          onKeyDown={(e) => onRowKeyDown(e, node)}
          onMouseEnter={() => {
            if (node.type === "folder") {
              onFolderMouseEnter(node.id);
            }
          }}
          onMouseLeave={onFolderMouseLeave}
          role="treeitem"
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
          tabIndex={0}
        >
          {node.type === "folder" ? (
            <>
              <Collapsible open={isExpanded}>
                <CollapsibleTrigger asChild>
                  <Button className="h-4 w-4 p-0" size="sm" variant="ghost">
                    {folderDisclosureIcon(showDisclosure, isExpanded)}
                  </Button>
                </CollapsibleTrigger>
              </Collapsible>
              {isExpanded ? (
                <FolderOpen className="h-4 w-4 text-blue-500" />
              ) : (
                <Folder className="h-4 w-4 text-blue-500" />
              )}
            </>
          ) : (
            <>
              <div className="h-4 w-4" />
              <File className="h-4 w-4 text-gray-500" />
            </>
          )}

          {isRenaming ? (
            <Input
              className="h-6 flex-1 border-none p-0 text-xs shadow-none focus-visible:ring-1 focus-visible:ring-ring"
              onBlur={cancelRename}
              onChange={(e) =>
                setRenameState((prev) => ({ ...prev, value: e.target.value }))
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  confirmRename();
                } else if (e.key === "Escape") {
                  cancelRename();
                }
              }}
              ref={renameInputRef}
              value={renameState.value}
            />
          ) : (
            <span className="flex-1 truncate">{node.name}</span>
          )}

          {node.type === "folder" && isHovered && !isRenaming ? (
            <div className="ml-auto flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <Button
                className="h-4 w-4 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  startInlineCreate(node.id, "file");
                }}
                size="sm"
                title="New File"
                variant="ghost"
              >
                <FileText className="h-3 w-3" />
              </Button>
              <Button
                className="h-4 w-4 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  startInlineCreate(node.id, "folder");
                }}
                size="sm"
                title="New Folder"
                variant="ghost"
              >
                <FolderPlus className="h-3 w-3" />
              </Button>
            </div>
          ) : null}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        {node.type === "folder" ? (
          <>
            <ContextMenuItem onClick={() => startInlineCreate(node.id, "file")}>
              <FileText className="mr-2 h-4 w-4" />
              New File
            </ContextMenuItem>
            <ContextMenuItem
              onClick={() => startInlineCreate(node.id, "folder")}
            >
              <FolderPlus className="mr-2 h-4 w-4" />
              New Folder
            </ContextMenuItem>
            <ContextMenuSeparator />
          </>
        ) : null}
        <ContextMenuItem onClick={() => startRename(node.id, node.name)}>
          <Edit className="mr-2 h-4 w-4" />
          Rename
        </ContextMenuItem>
        <ContextMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() => handleDelete(node.id)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

export function FileTree({
  data,
  selectedNodeId,
  onNodeSelect,
  onNodeCreate,
  onNodeRename,
  onNodeDelete,
}: FileTreeProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set()
  );
  const [selectedNode, setSelectedNode] = useState<string | null>(
    selectedNodeId ?? null
  );
  const [hoveredFolder, setHoveredFolder] = useState<string | null>(null);
  const [inlineInput, setInlineInput] = useState<InlineInputState>({
    folderId: null,
    type: null,
    value: "",
  });
  const [renameState, setRenameState] = useState<RenameState>({
    nodeId: null,
    value: "",
  });

  const createInputRef = useRef<HTMLInputElement>(null);
  const renameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectedNodeId !== undefined) {
      setSelectedNode(selectedNodeId);
    }
  }, [selectedNodeId]);

  useEffect(() => {
    if (inlineInput.type && createInputRef.current) {
      const id = window.setTimeout(() => {
        createInputRef.current?.focus();
        createInputRef.current?.select();
      }, 0);
      return () => window.clearTimeout(id);
    }
  }, [inlineInput.type]);

  useEffect(() => {
    if (renameState.nodeId && renameInputRef.current) {
      const id = window.setTimeout(() => {
        renameInputRef.current?.focus();
        renameInputRef.current?.select();
      }, 0);
      return () => window.clearTimeout(id);
    }
  }, [renameState.nodeId]);

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  };

  const handleNodeClick = (node: FileTreeNode) => {
    if (node.type === "folder") {
      toggleFolder(node.id);
    }
    setSelectedNode(node.id);
    onNodeSelect?.(node);
  };

  const handleRowKeyDown = (
    e: KeyboardEvent<HTMLDivElement>,
    node: FileTreeNode
  ) => {
    if (renameState.nodeId === node.id) {
      return;
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleNodeClick(node);
    }
  };

  const startInlineCreate = (
    folderId: string | null,
    type: "file" | "folder"
  ) => {
    if (folderId) {
      setExpandedFolders((prev) => new Set([...prev, folderId]));
    }

    setInlineInput({
      folderId,
      type,
      value: "",
    });
  };

  const confirmInlineCreate = () => {
    if (inlineInput.value.trim() && inlineInput.type) {
      onNodeCreate?.(
        inlineInput.folderId,
        inlineInput.value.trim(),
        inlineInput.type
      );
      setInlineInput({ folderId: null, type: null, value: "" });
    }
  };

  const cancelInlineCreate = () => {
    setInlineInput({ folderId: null, type: null, value: "" });
  };

  const startRename = (nodeId: string, currentName: string) => {
    setRenameState({ nodeId, value: currentName });
  };

  const confirmRename = () => {
    if (renameState.value.trim() && renameState.nodeId) {
      onNodeRename?.(renameState.nodeId, renameState.value.trim());
      setRenameState({ nodeId: null, value: "" });
    }
  };

  const cancelRename = () => {
    setRenameState({ nodeId: null, value: "" });
  };

  const handleDelete = (nodeId: string) => {
    onNodeDelete?.(nodeId);
  };

  const renderInlineInput = (folderId: string | null, depth: number) => {
    if (inlineInput.folderId !== folderId || !inlineInput.type) {
      return null;
    }

    return (
      <div
        className="flex items-center gap-1 px-2 py-1 text-sm"
        style={{ paddingLeft: `${depth * 12 + 20}px` }}
      >
        <div className="h-4 w-4" />
        {inlineInput.type === "folder" ? (
          <Folder className="h-4 w-4 text-blue-500" />
        ) : (
          <File className="h-4 w-4 text-gray-500" />
        )}
        <Input
          className="h-6 border-none p-0 text-xs shadow-none focus-visible:ring-1 focus-visible:ring-ring"
          onBlur={cancelInlineCreate}
          onChange={(e) =>
            setInlineInput((prev) => ({ ...prev, value: e.target.value }))
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              confirmInlineCreate();
            } else if (e.key === "Escape") {
              cancelInlineCreate();
            }
          }}
          placeholder={`New ${inlineInput.type}`}
          ref={createInputRef}
          value={inlineInput.value}
        />
        <Button
          className="h-4 w-4 p-0"
          onClick={confirmInlineCreate}
          size="sm"
          variant="ghost"
        >
          <Check className="h-3 w-3" />
        </Button>
        <Button
          className="h-4 w-4 p-0"
          onClick={cancelInlineCreate}
          size="sm"
          variant="ghost"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    );
  };

  const renderNode = (node: FileTreeNode, depth = 0) => {
    const isExpanded = expandedFolders.has(node.id);
    const isSelected = selectedNode === node.id;
    const hasChildren = Boolean(node.children && node.children.length > 0);
    const isHovered = hoveredFolder === node.id;
    const isRenaming = renameState.nodeId === node.id;

    return (
      <div key={node.id}>
        <FileTreeRow
          cancelRename={cancelRename}
          confirmRename={confirmRename}
          depth={depth}
          handleDelete={handleDelete}
          hasChildren={hasChildren}
          inlineFolderId={inlineInput.folderId}
          isExpanded={isExpanded}
          isHovered={isHovered}
          isRenaming={isRenaming}
          isSelected={isSelected}
          node={node}
          onFolderMouseEnter={setHoveredFolder}
          onFolderMouseLeave={() => setHoveredFolder(null)}
          onRowClick={handleNodeClick}
          onRowKeyDown={handleRowKeyDown}
          renameInputRef={renameInputRef}
          renameState={renameState}
          setRenameState={setRenameState}
          startInlineCreate={startInlineCreate}
          startRename={startRename}
        />

        {node.type === "folder" && renderInlineInput(node.id, depth)}

        {node.type === "folder" &&
        (hasChildren || inlineInput.folderId === node.id) ? (
          <Collapsible open={isExpanded}>
            <CollapsibleContent>
              {sortTreeNodes(node.children || []).map((child) =>
                renderNode(child, depth + 1)
              )}
            </CollapsibleContent>
          </Collapsible>
        ) : null}
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between border-b p-2">
        <span className="font-medium text-sm">Explorer</span>
        <div className="flex gap-1">
          <Button
            className="h-6 w-6 p-0"
            onClick={() => startInlineCreate(null, "file")}
            size="sm"
            title="New File"
            variant="ghost"
          >
            <FileText className="h-3 w-3" />
          </Button>
          <Button
            className="h-6 w-6 p-0"
            onClick={() => startInlineCreate(null, "folder")}
            size="sm"
            title="New Folder"
            variant="ghost"
          >
            <FolderPlus className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div className="min-h-[200px] p-1" role="tree">
            {renderInlineInput(null, 0)}
            {sortTreeNodes(data).map((node) => renderNode(node))}
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={() => startInlineCreate(null, "file")}>
            <FileText className="mr-2 h-4 w-4" />
            Create File
          </ContextMenuItem>
          <ContextMenuItem onClick={() => startInlineCreate(null, "folder")}>
            <FolderPlus className="mr-2 h-4 w-4" />
            Create Folder
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
}
