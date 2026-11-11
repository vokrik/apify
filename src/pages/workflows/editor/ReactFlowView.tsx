import "@xyflow/react/dist/style.css";
import {
  Background,
  BackgroundVariant,
  type Edge,
  Handle,
  type Node,
  type NodeChange,
  type NodeProps,
  Position,
  ReactFlow,
  ReactFlowProvider,
  applyNodeChanges,
  useReactFlow,
} from "@xyflow/react";
import { createContext, useContext, useState } from "react";

import { StepCard } from "./StepCard";
import { type EditorViewProps, placeholderSteps, type StepKind } from "./steps";

// Variant 1: a real React Flow canvas, laid out left to right like the schedule canvas
// (reference/console/schedules/). Nodes can be dragged and the canvas panned and zoomed.

type StepNode = Node<{ kind: StepKind }, "step">;

// Nodes only carry their step kind; the live step data comes from context, so React Flow keeps
// node positions (e.g. after dragging) when a step gets configured.
const StepsContext = createContext<EditorViewProps | null>(null);

// Apify's handles are small solid dots without a border.
const handleClass = "size-[5px]! min-h-0! min-w-0! border-0! bg-neutral-text!";

function StepFlowNode({ data }: NodeProps<StepNode>) {
  const { steps, onStepClick } = useContext(StepsContext)!;
  const step = steps.find((s) => s.kind === data.kind)!;
  return (
    <>
      <Handle type="target" position={Position.Left} className={handleClass} />
      <StepCard step={step} onClick={() => onStepClick(step.kind)} />
      <Handle type="source" position={Position.Right} className={handleClass} />
    </>
  );
}

const nodeTypes = { step: StepFlowNode };

/** Horizontal space between two nodes, in px. */
const GAP = 80;
/** Width of an unconfigured step card, used until React Flow has measured the nodes. */
const PLACEHOLDER_WIDTH = 260;

const initialNodes: StepNode[] = placeholderSteps.map((step, i) => ({
  id: step.kind,
  type: "step",
  position: { x: i * (PLACEHOLDER_WIDTH + GAP), y: 0 },
  data: { kind: step.kind },
}));

/** Cards grow with their content (e.g. a long task name), so lay them out by measured width. */
function layoutByWidth(nodes: StepNode[]): StepNode[] {
  let x = 0;
  return nodes.map((node) => {
    const placed = { ...node, position: { ...node.position, x } };
    x += (node.measured?.width ?? PLACEHOLDER_WIDTH) + GAP;
    return placed;
  });
}

const edges: Edge[] = placeholderSteps.slice(1).map((step, i) => ({
  id: `${placeholderSteps[i]!.kind}-${step.kind}`,
  source: placeholderSteps[i]!.kind,
  target: step.kind,
}));

function Canvas(props: EditorViewProps) {
  const { fitView } = useReactFlow();
  const [nodes, setNodes] = useState(initialNodes);
  const onNodesChange = (changes: NodeChange<StepNode>[]) => {
    // Re-flow only when a card's size changes (e.g. after picking a trigger), then re-center.
    // Dragged positions are kept otherwise.
    const resized = changes.some((c) => c.type === "dimensions");
    setNodes((current) => {
      const next = applyNodeChanges(changes, current);
      return resized ? layoutByWidth(next) : next;
    });
    if (resized) requestAnimationFrame(() => void fitView({ maxZoom: 1 }));
  };

  return (
    <StepsContext value={props}>
      <div data-test="automation-canvas-react-flow" className="h-full">
        <ReactFlow
          nodes={nodes}
          onNodesChange={onNodesChange}
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
    </StepsContext>
  );
}

export function ReactFlowView(props: EditorViewProps) {
  return (
    <ReactFlowProvider>
      <Canvas {...props} />
    </ReactFlowProvider>
  );
}
