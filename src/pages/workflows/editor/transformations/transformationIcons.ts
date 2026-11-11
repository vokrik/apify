import type { ComponentType } from "react";

import {
  ArrowsDiffIcon,
  type IconProps,
  ListCheckIcon,
  MoodSmileIcon,
  SquareMinusIcon,
  SquarePlusIcon,
  TrendingDownIcon,
} from "@/components/icons";
import type { TransformationId } from "@/data/types";

export const transformationIcons: Record<TransformationId, ComponentType<IconProps>> = {
  "get-changed-rows": ArrowsDiffIcon,
  "get-new-rows": SquarePlusIcon,
  "get-missing-rows": SquareMinusIcon,
  "products-below-threshold": TrendingDownIcon,
  "filter-incomplete-data": ListCheckIcon,
  "filter-by-sentiment": MoodSmileIcon,
};
