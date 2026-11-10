import "@xyflow/react/dist/style.css";
import {
  Background,
  BackgroundVariant,
  type Edge,
  Handle,
  type Node,
  type NodeProps,
  Position,
  ReactFlow,
} from "@xyflow/react";

import { StepCard } from "./StepCard";
import { type AutomationStep, placeholderSteps } from "./steps";

// Variant 1: a real React Flow canvas, laid out left to right like the schedule canvas
// (reference/console/schedules/). Nodes can be dragged and the canvas panned and zoomed.

type StepNode = Node<{ step: AutomationStep }, "step">;

// Apify's handles are small solid dots without a border.
const handleClass = "size-[5px]! min-h-0! min-w-0! border-0! bg-neutral-text!";

function StepFlowNode({ data }: NodeProps<StepNode>) {
  return (
    <>
      <Handle type="target" position={Position.Left} className={handleClass} />
      <StepCard step={data.step} />
      <Handle type="source" position={Position.Right} className={handleClass} />
    </>
  );
}

const nodeTypes = { step: StepFlowNode };

const COLUMN = 340;

const nodes: StepNode[] = placeholderSteps.map((step, i) => ({
  id: step.kind,
  type: "step",
  position: { x: i * COLUMN, y: 0 },
  data: { step },
}));

const edges: Edge[] = placeholderSteps.slice(1).map((step, i) => ({
  id: `${placeholderSteps[i]!.kind}-${step.kind}`,
  source: placeholderSteps[i]!.kind,
  target: step.kind,
}));

export function ReactFlowView() {
  return (
    <div data-test="automation-canvas-react-flow" className="h-full">
      <ReactFlow
        defaultNodes={nodes}
        defaultEdges={edges}
        nodeTypes={nodeTypes}
        colorMode="dark"
        fitView
        fitViewOptions={{ maxZoom: 1 }}
        nodesConnectable={false}
        elementsSelectable={false}
        defaultEdgeOptions={{
          style: { stroke: "var(--color-primary-text)", strokeWidth: 1 },
        }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={14}
          size={1}
          color="var(--color-neutral-separator-subtle)"
          bgColor="var(--color-neutral-background)"
        />
      </ReactFlow>
    </div>
  );
}
