import React from "react";

// “Registry style” keys; keeps autocomplete but allows extension via const assertions.
export type TNodeKey = (typeof NodeKeys)[number];
export const NodeKeys = [
	"events",
	"cabinet",
	"schedule",
	"payment",
	"tariffs",
	"clients",
] as const;

export type TSpecialNodeKey = "empty" | "loading" | "not_found";
export type TAnyNodeKey = TNodeKey | TSpecialNodeKey;

type TRenderable = React.ReactNode | (() => React.ReactNode);

type TGuardFn = (ctx: { roles?: string[]; authed?: boolean }) => boolean;

export type IconComponent =
	React.ComponentType<React.SVGProps<SVGSVGElement> & { className?: string }>;


type TBaseNode = {
	key: TNodeKey;
	title: string;
	icon?: IconComponent;
	parentKey?: TNodeKey;
	body: TRenderable;
	/** Optional Next.js path for deep linking (won’t be used by core unless you choose) */
	path?: `/${string}`;
	/** Optional visibility/auth guard */
	visible?: boolean | TGuardFn;
	active?: boolean;
};

export type TTabNode = TBaseNode & { type: "tab" };
export type TScreenNode = TBaseNode & { type: "screen" };
export type TNavigationNode = TTabNode | TScreenNode;

export interface INavigationContext {
	activeNodeKey: TAnyNodeKey;
	setActiveNodeKey: (key: TAnyNodeKey) => void;
	go: (key: TNodeKey) => void;
	back: () => void;
	nodeHistory: TAnyNodeKey[];
	activeNode?: TNavigationNode;
	nodes: TNavigationNode[];
	tabs: TTabNode[];
}

export const isTab = (n: TNavigationNode): n is TTabNode => n.type === "tab";
export const renderNode = (n?: TNavigationNode) =>
	!n
		? null
		: typeof n.body === "function"
			? (n.body as () => React.ReactNode)()
			: n.body;

/** Example guard check (use in provider before exposing nodes) */
export const isVisible = (
	n: TNavigationNode,
	ctx: { roles?: string[]; authed?: boolean } = {},
) => (typeof n.visible === "function" ? n.visible(ctx) : (n.visible ?? true));
