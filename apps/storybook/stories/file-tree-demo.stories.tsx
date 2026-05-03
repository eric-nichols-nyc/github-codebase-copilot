import { FileTreeDemo } from "@repo/design-system/components/file-tree";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "patterns/FileTreeDemo",
  component: FileTreeDemo,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof FileTreeDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
