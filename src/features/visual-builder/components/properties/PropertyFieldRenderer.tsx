import React from "react";
import type { ComponentPropField } from "../../types/component-definition.types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface PropertyFieldProps {
  field: ComponentPropField;
  value: any;
  onChange: (value: any) => void;
}

export const PropertyFieldRenderer: React.FC<PropertyFieldProps> = ({ field, value, onChange }) => {
  const label = <Label className="mb-1.5 block text-[11px] font-medium text-muted-foreground">{field.label}</Label>;

  switch (field.type) {
    case "text":
      return (
        <div className="space-y-1">
          {label}
          <Input
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="h-8 text-sm"
          />
        </div>
      );
    case "number":
      return (
        <div className="space-y-1">
          {label}
          <Input
            type="number"
            value={value || 0}
            onChange={(e) => onChange(Number(e.target.value))}
            className="h-8 text-sm"
          />
        </div>
      );
    case "textarea":
      return (
        <div className="space-y-1">
          {label}
          <Textarea
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="text-sm min-h-[80px]"
          />
        </div>
      );
    case "switch":
      return (
        <div className="flex items-center justify-between rounded-md border bg-muted/20 px-3 py-2">
          {label}
          <Switch checked={!!value} onCheckedChange={onChange} />
        </div>
      );
    case "select":
    case "variant":
    case "size":
      return (
        <div className="space-y-1">
          {label}
          <Select value={String(value)} onValueChange={onChange}>
            <SelectTrigger className=" text-sm w-full">
              <SelectValue placeholder={`Select ${field.label}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    default:
      return null;
  }
};
