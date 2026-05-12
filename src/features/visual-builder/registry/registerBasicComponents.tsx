import type { ComponentDefinition } from "../types/component-definition.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react";

export const registerBasicComponents: Record<string, ComponentDefinition> = {
  icon: {
    key: "icon",
    name: "Icon",
    category: "basic",
    acceptsChildren: false,
    defaultProps: {
      icon: "Star",
      size: 24,
      color: "#000000",
      className: "",
    },
    propSchema: [
      {
        key: "icon",
        label: "Icon Name",
        type: "select",
        options: [
          { label: "Star", value: "Star" },
          { label: "Heart", value: "Heart" },
          { label: "Home", value: "Home" },
          { label: "User", value: "User" },
          { label: "Settings", value: "Settings" },
          { label: "Search", value: "Search" },
          { label: "Bell", value: "Bell" },
          { label: "Calendar", value: "Calendar" },
          { label: "Camera", value: "Camera" },
          { label: "Cloud", value: "Cloud" },
          { label: "Check", value: "Check" },
          { label: "X", value: "X" },
          { label: "Info", value: "Info" },
          { label: "Help-Circle", value: "HelpCircle" },
          { label: "Menu", value: "Menu" },
          { label: "More-Horizontal", value: "MoreHorizontal" },
          { label: "Arrow-Right", value: "ArrowRight" },
          { label: "External-Link", value: "ExternalLink" },
          { label: "Lock", value: "Lock" },
          { label: "Mail", value: "Mail" },
        ],
      },
      { key: "size", label: "Size (px)", type: "number" },
      { key: "color", label: "Color", type: "text" },
      { key: "className", label: "Custom Tailwind Classes", type: "text" },
    ],
    render: (node, context) => {
      const { icon, size, color, className } = node.props;
      const IconComponent = (LucideIcons as any)[icon];
      
      if (!IconComponent) return null;
      
      return (
        <span 
          onClick={(e) => { 
            e.stopPropagation(); 
            context.onSelectNode(node.id, e.ctrlKey || e.metaKey); 
          }}
        >
          <IconComponent 
            size={size} 
            color={color} 
            className={cn("inline-block", className)}
          />
        </span>
      );
    },
  },
  button: {
    key: "button",
    name: "Button",
    category: "basic",
    acceptsChildren: false,
    defaultProps: {
      label: "Button",
      variant: "default",
      size: "default",
      className: "",
    },
    propSchema: [
      { key: "label", label: "Label", type: "text" },
      { key: "className", label: "Custom Tailwind Classes", type: "text" },
      {
        key: "variant",
        label: "Variant",
        type: "variant",
        options: [
          { label: "Default", value: "default" },
          { label: "Secondary", value: "secondary" },
          { label: "Destructive", value: "destructive" },
          { label: "Outline", value: "outline" },
          { label: "Ghost", value: "ghost" },
          { label: "Link", value: "link" },
        ],
      },
      {
        key: "size",
        label: "Size",
        type: "size",
        options: [
          { label: "Default", value: "default" },
          { label: "Sm", value: "sm" },
          { label: "Lg", value: "lg" },
          { label: "Icon", value: "icon" },
        ],
      },
    ],
    render: (node, context) => (
      <Button
        variant={node.props.variant}
        size={node.props.size}
        className={node.props.className}
        onClick={(e) => {
          e.stopPropagation();
          context.onSelectNode(node.id, e.ctrlKey || e.metaKey);
        }}
      >
        {node.props.label}
      </Button>
    ),
  },
  input: {
    key: "input",
    name: "Input",
    category: "form",
    acceptsChildren: false,
    defaultProps: {
      placeholder: "Enter text...",
      type: "text",
      className: "",
    },
    propSchema: [
      { key: "placeholder", label: "Placeholder", type: "text" },
      { key: "className", label: "Custom Tailwind Classes", type: "text" },
      {
        key: "type",
        label: "Type",
        type: "select",
        options: [
          { label: "Text", value: "text" },
          { label: "Password", value: "password" },
          { label: "Email", value: "email" },
          { label: "Number", value: "number" },
        ],
      },
    ],
    render: (node, context) => (
      <Input
        type={node.props.type}
        placeholder={node.props.placeholder}
        className={node.props.className}
        onClick={(e) => {
          e.stopPropagation();
          context.onSelectNode(node.id, e.ctrlKey || e.metaKey);
        }}
        readOnly
      />
    ),
  },
  badge: {
    key: "badge",
    name: "Badge",
    category: "display",
    acceptsChildren: false,
    defaultProps: {
      label: "Badge",
      variant: "default",
      className: "",
    },
    propSchema: [
      { key: "label", label: "Label", type: "text" },
      { key: "className", label: "Custom Tailwind Classes", type: "text" },
      {
        key: "variant",
        label: "Variant",
        type: "select",
        options: [
          { label: "Default", value: "default" },
          { label: "Secondary", value: "secondary" },
          { label: "Outline", value: "outline" },
          { label: "Destructive", value: "destructive" },
        ],
      },
    ],
    render: (node, context) => (
      <Badge
        variant={node.props.variant}
        className={node.props.className}
        onClick={(e) => {
          e.stopPropagation();
          context.onSelectNode(node.id, e.ctrlKey || e.metaKey);
        }}
      >
        {node.props.label}
      </Badge>
    ),
  },
  card: {
    key: "card",
    name: "Card",
    category: "display",
    acceptsChildren: true,
    defaultProps: {
      title: "Card Title",
      description: "Card Description",
      content: "Card content goes here.",
      className: "w-full",
    },
    propSchema: [
      { key: "title", label: "Title", type: "text" },
      { key: "description", label: "Description", type: "text" },
      { key: "content", label: "Content", type: "textarea" },
      { key: "className", label: "Custom Tailwind Classes", type: "text" },
    ],
    render: (node, context) => (
      <Card
        onClick={(e) => {
          e.stopPropagation();
          context.onSelectNode(node.id, e.ctrlKey || e.metaKey);
        }}
        className={cn(node.props.className)}
      >
        <CardHeader>
          <CardTitle>{node.props.title}</CardTitle>
          <CardDescription>{node.props.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{node.props.content}</p>
        </CardContent>
      </Card>
    ),
  },
  textarea: {
    key: "textarea",
    name: "Textarea",
    category: "form",
    acceptsChildren: false,
    defaultProps: {
      placeholder: "Enter details...",
      className: "",
    },
    propSchema: [
      { key: "placeholder", label: "Placeholder", type: "text" },
      { key: "className", label: "Custom Tailwind Classes", type: "text" },
    ],
    render: (node, context) => (
      <Textarea
        placeholder={node.props.placeholder}
        className={node.props.className}
        onClick={(e) => {
          e.stopPropagation();
          context.onSelectNode(node.id);
        }}
        readOnly
      />
    ),
  },
  checkbox: {
    key: "checkbox",
    name: "Checkbox",
    category: "form",
    acceptsChildren: false,
    defaultProps: {
      label: "Accept terms",
      checked: false,
      className: "",
    },
    propSchema: [
      { key: "label", label: "Label", type: "text" },
      { key: "className", label: "Custom Tailwind Classes", type: "text" },
      { key: "checked", label: "Checked", type: "switch" },
    ],
    render: (node, context) => (
      <div 
        className={cn("flex items-center space-x-2", node.props.className)}
        onClick={(e) => {
          e.stopPropagation();
          context.onSelectNode(node.id);
        }}
      >
        <Checkbox checked={node.props.checked} id={node.id} />
        <Label htmlFor={node.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {node.props.label}
        </Label>
      </div>
    ),
  },
  switch: {
    key: "switch",
    name: "Switch",
    category: "form",
    acceptsChildren: false,
    defaultProps: {
      label: "Sync Status",
      checked: true,
      className: "",
    },
    propSchema: [
      { key: "label", label: "Label", type: "text" },
      { key: "className", label: "Custom Tailwind Classes", type: "text" },
      { key: "checked", label: "Checked", type: "switch" },
    ],
    render: (node, context) => (
      <div 
        className={cn("flex items-center space-x-2", node.props.className)}
        onClick={(e) => {
          e.stopPropagation();
          context.onSelectNode(node.id);
        }}
      >
        <Switch checked={node.props.checked} id={node.id} />
        <Label htmlFor={node.id} className="text-sm font-medium">
          {node.props.label}
        </Label>
      </div>
    ),
  },
  alert: {
    key: "alert",
    name: "Alert",
    category: "display",
    acceptsChildren: false,
    defaultProps: {
      title: "Attention",
      description: "Something happened that needs your attention.",
      variant: "default",
      className: "",
    },
    propSchema: [
      { key: "title", label: "Title", type: "text" },
      { key: "description", label: "Description", type: "text" },
      { key: "className", label: "Custom Tailwind Classes", type: "text" },
      {
        key: "variant",
        label: "Variant",
        type: "select",
        options: [
          { label: "Default", value: "default" },
          { label: "Destructive", value: "destructive" },
        ],
      },
    ],
    render: (node, context) => (
      <Alert
        variant={node.props.variant}
        className={node.props.className}
        onClick={(e) => {
          e.stopPropagation();
          context.onSelectNode(node.id);
        }}
      >
        <AlertTitle>{node.props.title}</AlertTitle>
        <AlertDescription>{node.props.description}</AlertDescription>
      </Alert>
    ),
  },
  label: {
    key: "label",
    name: "Label",
    category: "display",
    acceptsChildren: false,
    defaultProps: {
      text: "Label Text",
      className: "",
    },
    propSchema: [
      { key: "text", label: "Text", type: "text" },
      { key: "className", label: "Custom Tailwind Classes", type: "text" },
    ],
    render: (node, context) => (
      <Label
        className={node.props.className}
        onClick={(e) => {
          e.stopPropagation();
          context.onSelectNode(node.id);
        }}
      >
        {node.props.text}
      </Label>
    ),
  },

  separator: {
    key: "separator",
    name: "Separator",
    category: "display",
    acceptsChildren: false,
    defaultProps: {
      orientation: "horizontal",
    },
    propSchema: [
      {
        key: "orientation",
        label: "Orientation",
        type: "select",
        options: [
          { label: "Horizontal", value: "horizontal" },
          { label: "Vertical", value: "vertical" },
        ],
      },
    ],
    render: (node, context) => (
      <Separator
        orientation={node.props.orientation}
        className={node.props.orientation === 'vertical' ? 'h-10' : 'w-full'}
        onClick={(e) => {
          e.stopPropagation();
          context.onSelectNode(node.id);
        }}
      />
    ),
  },
};
